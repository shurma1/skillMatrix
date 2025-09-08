import {DatePicker} from "antd";
import type {PickerProps, PickerPropsWithMultiple} from "antd/es/date-picker/generatePicker/interface";
import dayjs, {type Dayjs} from "dayjs";
import {type FC, useState} from "react";

const dateFormat = 'DD.MM.YYYY';

const DatePickerWithPaste: FC<PickerPropsWithMultiple<Dayjs, PickerProps<Dayjs>>> = (props) => {
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
	
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedText = e.clipboardData.getData('text');
		
		const parsedDate = dayjs(pastedText);
		
		if (parsedDate.isValid()) {
			setSelectedDate(parsedDate);
			e.preventDefault();
		}
	};
	
	return (
		<DatePicker
			value={selectedDate || undefined}
			style={{ width: '100%' }}
			format={dateFormat}
			onPaste={handlePaste}
			{...props}
		/>
	);
};

export default DatePickerWithPaste;
