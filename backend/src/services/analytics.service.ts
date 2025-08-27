import JobRoleService from "./jobRole.service";
import {sumByColumns, sumMatrix, transpose} from "../utils/Matrix";
import {calcPercent} from "../utils/calcPercent";
import SkillService from "./skill.service";
import UserService from "./user.service";
import {formatDate} from "../utils/formatDate";
import SkillRepository from "../repositories/skill.repository";
import JobRoleRepository from "../repositories/jobRole.repository";
import ExcelJS from 'exceljs';

class AnalyticsService {
	async kpi() {
		const jobRoles = await JobRoleService.getAll();
		
		const rowLabels = jobRoles.map(jobRole => jobRole.title);
		rowLabels.push('Итог');
		const colLabels = ['Кол-во', 'Цель', 'Общ.', 'Факт.', '%'];
		
		const dataMatrix: number[][] = [];
		
		for(let i = 0; i < jobRoles.length; i++) {
			const jobRole = jobRoles[i];
			
			const rowData: number[] = [];
			
			const employeeCount = await JobRoleService.getEmployeesCount(jobRole.id);
			
			const jobRoleTargetLevel = await JobRoleService.getTargetGeneralLevel(jobRole.id);
			
			const totalLevelForAllEmployee = employeeCount * jobRoleTargetLevel;
			
			const AllEmployeeForThisJobRoleCurrentLevel = await JobRoleService.getEmployeeCurrentLevel(jobRole.id);
			
			const percent = calcPercent(totalLevelForAllEmployee, AllEmployeeForThisJobRoleCurrentLevel);
			
			rowData.push(
				employeeCount,
				jobRoleTargetLevel,
				totalLevelForAllEmployee,
				AllEmployeeForThisJobRoleCurrentLevel,
				percent
			)
			
			dataMatrix.push(rowData);
		}
		
		const total: number[] = sumByColumns(dataMatrix);
		
		total[4] = calcPercent(total[2], total[3]);
		
		dataMatrix.push(total);
		
		return {
			colLabels,
			rowLabels,
			data: transpose(dataMatrix)
		}
	}
	
	async jobRolesToSkills() {
		const colLabels_1st_p = [
			'Ответсвенный за навык / документ',
			'Ответсвенный за подтверждение квалификации',
			'Number / Номер документа',
			'Стандарт / Навык',
			'Актуальная версия',
			'Дата утверждения'
		]
		
		const skills = await SkillService.getAll();
		
		const shortenTheName = (lastname: string, firstname: string) => {
			return `${lastname} ${firstname[0]}.`;
		}
		
		
		const data_1st_p = await Promise.all(
			skills.map(async skill => {
				
				const verifier = await UserService.getByID(skill.verifierId);
				const author = skill.authorId ? await UserService.getByID(skill.authorId) : null;
				
				return [
					shortenTheName(verifier.lastname, verifier.firstname),
					author ? shortenTheName(author.lastname, author.firstname) : null,
					skill.documentId || null,
					skill.title,
					skill.version,
					formatDate(skill.approvedDate) || null
				]
			})
		)
		
		const jobRoles = await JobRoleService.getAll();
		
		const colLabels_2st_p = jobRoles.map(jobRole => jobRole.title);
		
		const skillIds = skills.map(skill => skill.skillId);
		const jobRoleIds = jobRoles.map(jobRole => jobRole.id);
		
		const dataMatrix = await JobRoleRepository.getLevelMatrixBySkills(skillIds, jobRoleIds);
		
		const totalSum = sumByColumns(dataMatrix);
		
		
		
		return {
			left: {
				colLabels: colLabels_1st_p,
				data: data_1st_p
			},
			right: {
				colLabels: [colLabels_2st_p, totalSum],
				data: dataMatrix
			}
		}
	}
	
	async jobRoleToSkills(jobRoleId: string, userId?: string) {
		
		const colLabels_1st_p = [
			'Number / Номер документа',
			'Стандарт / Навык',
			'Актуальная версия',
			'Дата утверждения'
		]
		
		const allSkills = await SkillService.getAll();
		const skillsByJobrole = await JobRoleService.getSkills(jobRoleId);
		
		const skills = allSkills.filter(skill =>
			skillsByJobrole.some(s => s.skillId === skill.skillId)
		);
		
		const data_1st_p = await Promise.all(
			skills.map(async skill =>  ([
				skill.documentId || null,
				skill.title,
				skill.version,
				formatDate(skill.approvedDate) || null
			])
			)
		)
		
		const jobrole = await JobRoleService.getByID(jobRoleId);
		const skillIds = skills.map(skill => skill.skillId);
		
		const jobroleToSkillsMatrix = skillIds.length
			? await JobRoleRepository.getLevelMatrixBySkills(skillIds, [jobrole.id])
			: [[]];
		
		const jobroleToSkillsMatrixTotalSum = sumByColumns(jobroleToSkillsMatrix); // 1 занчение
		const jobRoleTarget = jobroleToSkillsMatrixTotalSum[0] || 0;
		
		const colLabels_2nd_p = [[jobrole.title], ['ЦЕЛЬ'], [jobRoleTarget]];
		
		let userIds: string[];
		let userNames: string[];
		
		if(!userId) {
			const users = await JobRoleService.getUsers(jobRoleId);
			userIds = users.map(user => user.userId);
			userNames = users.map(user => `${user.lastname} ${user.firstname}`);
		}
		else {
			userIds = [userId];
			const user = await UserService.getByID(userId);
			userNames = [`${user.lastname} ${user.firstname}`];
		}
		
		const userLevelMatrix = !!userIds.length && !!skillIds.length
			? await SkillRepository.getUserLevelMatrixBySkills(userIds, skillIds)
			: [[]];
		
		const userLevelMatrixTotalMatrix = sumByColumns(userLevelMatrix);
		const userLevelPercentMatrix = userLevelMatrixTotalMatrix.map(userLevel => calcPercent(userLevel, jobRoleTarget))
		
		const colLabels_3d_p = [userNames, userLevelPercentMatrix, userLevelMatrixTotalMatrix];
		
		return {
			left: {
				colLabels: colLabels_1st_p,
				data: data_1st_p
			},
			middle: {
				colLabels: colLabels_2nd_p,
				data: jobroleToSkillsMatrix
			},
			right: {
				colLabels: colLabels_3d_p,
				data: userLevelMatrix
			}
		}
	}
	
	async getUserStats(userId: string) {
		const user = await UserService.checkIsUserExist(userId);
		
		const jobRoles = await UserService.getAllJobroles(userId);
		
		const skillsByJobrole =  (
			await Promise.all(
				jobRoles.map(
					async jobRole => await JobRoleService.getSkills(jobRole.jobRoleId)
				)
			))
			.flat()
			.filter(skill=> skill.isActive);
		
		const userSkills = (await UserService.getAllSkills(userId)).filter(skill=> skill.isActive);
		
		
		const jobRoleIds = jobRoles.map(jobRole => jobRole.jobRoleId);
		const skillIds = [
			...new Set(
				[
					...skillsByJobrole.map(skill => skill.skillId),
					...userSkills.map(skill => skill.skillId),
				]
			)
		];
		
		console.log(skillIds, jobRoleIds);
		
		const jobroleToSkillsMatrix = skillIds.length && jobRoleIds.length
			? await JobRoleRepository.getLevelMatrixBySkills(skillIds, jobRoleIds)
			: [[]];
		
		console.log(jobroleToSkillsMatrix);
		
		const needLevel = sumMatrix(jobroleToSkillsMatrix) + userSkills.reduce((sum, skill) => sum + skill.targetLevel, 0);
		
		const userLevelMatrix = skillIds.length
			? await SkillRepository.getUserLevelMatrixBySkills([user.id], skillIds)
			: [[]];
		
		const userLevel = sumMatrix(userLevelMatrix);
		const percent = calcPercent(needLevel, userLevel);
		
		return {
			needLevel,
			userLevel,
			percent
		}
	}
	
	async downloadKPI() {
		const kpi = await this.kpi();

		// Create workbook and worksheet
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('KPI');

		const colLabels = kpi.colLabels; // ['Кол-во','Цель','Общ.','Факт.','%']
		const rowLabels = kpi.rowLabels; // job roles + 'Итог'
		const data = kpi.data; // Matrix in shape [cols][rows]

		// Header row: A1 label for row labels, then column labels starting from B1
		const a1 = worksheet.getCell(1, 1);
		a1.value = 'Должности';
		a1.font = { bold: true };
		a1.alignment = { vertical: 'middle', horizontal: 'left' };
		for (let j = 0; j < colLabels.length; j++) {
			const cell = worksheet.getCell(1, j + 2);
			cell.value = colLabels[j];
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
		}

		// Row labels in column A and data values starting from column B
		for (let i = 0; i < rowLabels.length; i++) {
			const r = i + 2; // data starts at row 2
			const isTotal = rowLabels[i] === 'Итог';
			const rowLabelCell = worksheet.getCell(r, 1);
			rowLabelCell.value = rowLabels[i];
			if (isTotal) {
				rowLabelCell.font = { bold: true };
			}
			rowLabelCell.alignment = { vertical: 'middle', horizontal: 'left' };

			for (let j = 0; j < colLabels.length; j++) {
				const c = j + 2;
				const value: any = data[j]?.[i] ?? 0;
				const cell = worksheet.getCell(r, c);
				// Format percent column as numeric percent
				if (colLabels[j] === '%') {
					const num = typeof value === 'number' ? value : Number(value) || 0;
					cell.value = num / 100; // e.g. 98 -> 0.98
					cell.numFmt = '0%';
				} else {
					cell.value = value;
				}
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
				if (isTotal) {
					cell.font = { bold: true };
				}
			}
		}

		// Simple column widths
		const calcTextWidth = (txt: string) => Math.max(10, Math.min(60, Math.round((txt ?? '').toString().length * 1.2)));
		worksheet.getColumn(1).width = Math.max(16, calcTextWidth('Должности'), ...rowLabels.map(l => calcTextWidth(l)));
		for (let j = 0; j < colLabels.length; j++) {
			worksheet.getColumn(j + 2).width = Math.max(8, calcTextWidth(colLabels[j]));
		}

		// Borders for the full table
		const lastRow = 1 + rowLabels.length;
		const lastCol = 1 + colLabels.length;
		for (let r = 1; r <= lastRow; r++) {
			for (let c = 1; c <= lastCol; c++) {
				worksheet.getCell(r, c).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				};
			}
		}

		// Highlight bottom-right percent cell in green like the example
		const totalPercentCell = worksheet.getCell(lastRow, lastCol);
		totalPercentCell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'C6EFCE' } // light green
		};
		totalPercentCell.font = { bold: true };

		// Freeze header row and first column
		worksheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];

		// Produce buffer and filename
		const arrayBuffer = await workbook.xlsx.writeBuffer();
		const buffer: Buffer = Buffer.isBuffer(arrayBuffer)
			? (arrayBuffer as Buffer)
			: Buffer.from(arrayBuffer as ArrayBuffer);

		const dateStr = new Date().toISOString().slice(0, 10);
		const filename = `kpi_${dateStr}.xlsx`;

		return {
			buffer,
			filename,
			contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
	}
	
	async downloadJobRolesToSkills() {
		const jobRolesToSkills = await this.jobRolesToSkills();

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('JobRolesToSkills');

		const leftCols = jobRolesToSkills.left.colLabels; // string[]
		const leftData = jobRolesToSkills.left.data as (string | number | null)[][];
		const roles = jobRolesToSkills.right.colLabels[0] as string[]; // role titles
		const targets = jobRolesToSkills.right.colLabels[1] as number[]; // target per role
		const matrix = jobRolesToSkills.right.data as number[][]; // skills x roles

		const leftColCount = leftCols.length; // usually 6
		const rightStartCol = leftColCount + 1; // start for roles

		// Header row 1: left headers + role names
		for (let j = 0; j < leftCols.length; j++) {
			const cell = worksheet.getCell(1, j + 1);
			cell.value = leftCols[j];
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
		}
		for (let j = 0; j < roles.length; j++) {
			const cell = worksheet.getCell(1, rightStartCol + j);
			cell.value = roles[j];
			cell.font = { bold: true };
			// Vertical text for right-side headers starting from G1
			cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 } as ExcelJS.Alignment;
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDEBF7' } }; // light blue
		}

		// Merge A..F over rows 1..3 and apply vertical text where required
		for (let col = 1; col <= Math.min(leftColCount, 6); col++) {
			worksheet.mergeCells(1, col, 3, col);
		}
		// A,B,C,E,F vertical text
		const verticalCols = [1, 2, 3, 5, 6].filter(c => c <= leftColCount);
		for (const c of verticalCols) {
			const cell = worksheet.getCell(1, c);
			cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 } as ExcelJS.Alignment;
		}
		// D1 background blue (merged D1:D3)
		if (leftColCount >= 4) {
			const d1 = worksheet.getCell(1, 4);
			d1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } };
		}

		// Make top header rows taller, and row 1 even taller to fit vertical role names
		worksheet.getRow(1).height = 80;
		worksheet.getRow(2).height = 60;
		worksheet.getRow(3).height = 60;

		// Header row 2: for right side put label "Цель"
		for (let j = 0; j < roles.length; j++) {
			const cell = worksheet.getCell(2, rightStartCol + j);
			cell.value = 'Цель';
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
		}

		// Header row 3: targets row (grey background)
		for (let j = 0; j < roles.length; j++) {
			const cell = worksheet.getCell(3, rightStartCol + j);
			cell.value = targets[j] ?? 0;
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } }; // grey
		}

		// Data rows start from row 4
		const startRow = 4;
		const rowCount = Math.max(leftData.length, matrix.length);
		for (let i = 0; i < rowCount; i++) {
			const excelRow = startRow + i;
			const leftRow = leftData[i] ?? [];
			// Left block
			for (let j = 0; j < leftColCount; j++) {
				const v = leftRow[j] ?? null;
				const cell = worksheet.getCell(excelRow, j + 1);
				cell.value = v as any;
				cell.alignment = { vertical: 'middle', horizontal: j >= 2 ? 'left' : 'center', wrapText: true };
			}
			// Right block (matrix)
			const mrow = matrix[i] ?? [];
			for (let j = 0; j < roles.length; j++) {
				const cell = worksheet.getCell(excelRow, rightStartCol + j);
				cell.value = mrow[j] ?? 0;
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
				// pale yellow fill, like example
				cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE9D9' } } as any; // subtle tint
			}
		}

		// Column widths: auto-ish for left, fixed for right
		const calcTextWidth = (txt: string) => Math.max(10, Math.min(60, Math.round((txt ?? '').toString().length * 1.2)));
		for (let j = 0; j < leftCols.length; j++) {
			const col = worksheet.getColumn(j + 1);
			const headerWidth = calcTextWidth(leftCols[j]);
			const dataWidths = leftData.map(r => calcTextWidth(String(r[j] ?? '')));
			const target = Math.max(14, headerWidth, ...dataWidths);
			// Fixed widths for A,B,C,E,F = 25; D = 40
			if (j === 0 || j === 1 || j === 2 || j === 4 || j === 5) {
				col.width = 20;
			} else if (j === 3) {
				col.width = 40;
			} else {
				col.width = target;
			}
		}
		for (let j = 0; j < roles.length; j++) {
			worksheet.getColumn(rightStartCol + j).width = 12;
		}

		// Borders for the whole used range
		const lastRow = startRow + rowCount - 1;
		const lastCol = rightStartCol + roles.length - 1;
		for (let r = 1; r <= Math.max(lastRow, 3); r++) {
			for (let c = 1; c <= lastCol; c++) {
				worksheet.getCell(r, c).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				};
			}
		}

		// Freeze header (top 3 rows) and left block (6 columns)
		worksheet.views = [{ state: 'frozen', xSplit: leftColCount, ySplit: 3 }];

		// Output buffer
		const arrayBuffer = await workbook.xlsx.writeBuffer();
		const buffer: Buffer = Buffer.isBuffer(arrayBuffer)
			? (arrayBuffer as Buffer)
			: Buffer.from(arrayBuffer as ArrayBuffer);

		const dateStr = new Date().toISOString().slice(0, 10);
		const filename = `job_roles_to_skills_${dateStr}.xlsx`;
		return {
			buffer,
			filename,
			contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
	}

	async downloadJobRoleToSkills(jobRoleId: string, userId?: string) {
		const jobRoleToSkills = await this.jobRoleToSkills(jobRoleId, userId);

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('JobRoleToSkills');

		const leftCols = jobRoleToSkills.left.colLabels as string[]; // 4 columns
		const leftData = jobRoleToSkills.left.data as (string | number | null)[][];

		const middleCols = jobRoleToSkills.middle.colLabels as (string | number)[][]; // [ [role], ['ЦЕЛЬ'], [target] ]
		const middleMatrix = jobRoleToSkills.middle.data as number[][]; // skills x 1

		const rightCols = jobRoleToSkills.right.colLabels as (string | number)[][]; // [ userNames[], percent[], totals[] ]
		const rightMatrix = jobRoleToSkills.right.data as number[][]; // skills x users

		const leftColCount = leftCols.length; // expected 4
		const midStartCol = leftColCount + 1; // 5 (E)
		const userCount = rightCols[0]?.length || 0;
		const rightStartCol = midStartCol + 1; // 6 (F)

		// Header row 1: left headers (vertical)
		for (let j = 0; j < leftCols.length; j++) {
			const cell = worksheet.getCell(1, j + 1);
			cell.value = leftCols[j];
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 } as ExcelJS.Alignment;
		}

		// Merge A1:A3, B1:B3, C1:C3, D1:D3
		for (let col = 1; col <= Math.min(4, leftColCount); col++) {
			worksheet.mergeCells(1, col, 3, col);
		}

		// Header row 1: middle (job role title) vertical, blue fill
		worksheet.getCell(1, midStartCol).value = (middleCols[0]?.[0] ?? '') as string;
		worksheet.getCell(1, midStartCol).font = { bold: true };
		worksheet.getCell(1, midStartCol).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 } as ExcelJS.Alignment;
		worksheet.getCell(1, midStartCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } };

		// Header row 1: right (user names) vertical, blue fill
		for (let j = 0; j < userCount; j++) {
			const cell = worksheet.getCell(1, rightStartCol + j);
			cell.value = rightCols[0]?.[j] ?? '';
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true, textRotation: 90 } as ExcelJS.Alignment;
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDEBF7' } };
		}

		// Row heights for vertical headers
		worksheet.getRow(1).height = 160;

		// Header row 2: middle 'ЦЕЛЬ' and right user percents
		worksheet.getCell(2, midStartCol).value = (middleCols[1]?.[0] ?? 'ЦЕЛЬ') as string;
		worksheet.getCell(2, midStartCol).font = { bold: true };
		worksheet.getCell(2, midStartCol).alignment = { vertical: 'middle', horizontal: 'center' };
		for (let j = 0; j < userCount; j++) {
			const val = (rightCols[1]?.[j] as number) ?? 0;
			const cell = worksheet.getCell(2, rightStartCol + j);
			cell.value = (typeof val === 'number' ? val : Number(val) || 0) / 100; // percent to fraction
			cell.numFmt = '0%';
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
		}

		// Header row 3: middle target and right user totals (grey)
		worksheet.getCell(3, midStartCol).value = (middleCols[2]?.[0] as number) ?? 0;
		worksheet.getCell(3, midStartCol).font = { bold: true };
		worksheet.getCell(3, midStartCol).alignment = { vertical: 'middle', horizontal: 'center' };
		worksheet.getCell(3, midStartCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
		for (let j = 0; j < userCount; j++) {
			const cell = worksheet.getCell(3, rightStartCol + j);
			cell.value = (rightCols[2]?.[j] as number) ?? 0;
			cell.font = { bold: true };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
		}

		// Data rows start at 4
		const startRow = 4;
		const rowCount = Math.max(leftData.length, middleMatrix.length, rightMatrix.length);
		for (let i = 0; i < rowCount; i++) {
			const r = startRow + i;
			const leftRow = leftData[i] ?? [];
			// Left block
			for (let j = 0; j < leftColCount; j++) {
				const cell = worksheet.getCell(r, j + 1);
				cell.value = (leftRow[j] ?? null) as any;
				cell.alignment = { vertical: 'middle', horizontal: j >= 1 ? 'left' : 'center', wrapText: true };
			}
			// Middle block
			const mval = middleMatrix[i]?.[0] ?? 0;
			const mcell = worksheet.getCell(r, midStartCol);
			mcell.value = mval;
			mcell.alignment = { vertical: 'middle', horizontal: 'center' };
			mcell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE9D9' } } as any;
			// Right block (users)
			const urow = rightMatrix[i] ?? [];
			for (let j = 0; j < userCount; j++) {
				const cell = worksheet.getCell(r, rightStartCol + j);
				cell.value = urow[j] ?? 0;
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
				cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE9D9' } } as any;
			}
		}

		// Column widths
		const calcTextWidth = (txt: string) => Math.max(10, Math.min(60, Math.round((txt ?? '').toString().length * 1.2)));
		for (let j = 0; j < leftCols.length; j++) {
			const col = worksheet.getColumn(j + 1);
			const headerWidth = calcTextWidth(leftCols[j]);
			const dataWidths = leftData.map(r => calcTextWidth(String(r[j] ?? '')));
			col.width = Math.max(16, headerWidth, ...dataWidths);
		}
		worksheet.getColumn(midStartCol).width = 12;
		for (let j = 0; j < userCount; j++) {
			worksheet.getColumn(rightStartCol + j).width = 12;
		}

		// Borders
		const lastRow = startRow + rowCount - 1;
		const lastCol = rightStartCol + Math.max(0, userCount - 1);
		for (let r = 1; r <= Math.max(lastRow, 3); r++) {
			for (let c = 1; c <= Math.max(lastCol, midStartCol); c++) {
				worksheet.getCell(r, c).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				};
			}
		}

		// Freeze header (top 3 rows) and left block + middle column (A-E) so scrolling starts from F
		worksheet.views = [{ state: 'frozen', xSplit: midStartCol, ySplit: 3 }];

		// Output buffer
		const arrayBuffer = await workbook.xlsx.writeBuffer();
		const buffer: Buffer = Buffer.isBuffer(arrayBuffer)
			? (arrayBuffer as Buffer)
			: Buffer.from(arrayBuffer as ArrayBuffer);

		const dateStr = new Date().toISOString().slice(0, 10);
		const filename = `job_role_to_skills_${dateStr}.xlsx`;
		return {
			buffer,
			filename,
			contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		};
	}
}

export default new AnalyticsService();
