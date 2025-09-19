import { readFileSync } from 'fs';
import { join } from 'path';
import { Logger } from "../src/utils/logger";
import SkillRepository from "../src/repositories/skill.repository";

interface SkillVersionUpdate {
    skillId: string;
    version: number;
}

const start = async () => {
    try {
        // Читаем файл skillVersions.json
        const skillVersionsPath = join(__dirname, 'skillVersions.json');
        const skillVersionsData = readFileSync(skillVersionsPath, 'utf8');
        const skillVersionUpdates: SkillVersionUpdate[] = JSON.parse(skillVersionsData);

        Logger.log(`Found ${skillVersionUpdates.length} skills to update`);

        // Перебираем все элементы массива
        for (const update of skillVersionUpdates) {
            const { skillId, version } = update;
            
            Logger.log(`Processing skill ${skillId} with target version ${version}`);

            try {
                // Получаем навык и его последнюю версию
                const skill = await SkillRepository.getByID(skillId);
                if (!skill) {
                    Logger.error(`Skill with ID ${skillId} not found`);
                    continue;
                }

                const lastVersion = await SkillRepository.getLastVersion(skillId);
                if (!lastVersion) {
                    Logger.error(`No versions found for skill ${skillId}`);
                    continue;
                }

                Logger.log(`Current version: ${lastVersion.version}, target version: ${version}`);

                // Обновляем версию последней версии навыка
                lastVersion.version = version;
                await lastVersion.save();

                Logger.log(`Successfully updated skill ${skillId} (${skill.title}) version to ${version}`);

            } catch (error) {
                Logger.error(`Failed to update skill ${skillId}: ${error}`);
            }
        }

        Logger.log('Skill versions update completed!');

    } catch (error) {
        Logger.error(`Failed to read skillVersions.json or process updates: ${error}`);
    }
};

start();