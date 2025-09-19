import { useEffect } from 'react';
import { Modal, Form, DatePicker, Button } from 'antd';
import type { FC } from 'react';
import dayjs from 'dayjs';
import type { MakeRevisionDTO } from '@/types/api/skill';

interface MakeRevisionModalProps {
  open: boolean;
  confirmLoading: boolean;
  skillId: string;
  currentAuditDate?: string;
  onCancel: () => void;
  onSubmit: (values: MakeRevisionDTO) => Promise<void>;
}

const MakeRevisionModal: FC<MakeRevisionModalProps> = ({
  open,
  confirmLoading,
  skillId,
  currentAuditDate,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      // Дата ревизии по умолчанию: текущее число + 3 года
      const defaultDate = dayjs().add(3, 'year');
      form.setFieldsValue({
        date: defaultDate
      });
    } else {
      // Сбрасываем форму при закрытии модального окна
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = async (values: { date: dayjs.Dayjs }) => {
    try {
      const formattedDate = values.date.toISOString();
      await onSubmit({
        skillId,
        date: formattedDate
      });
      
      // Успешно выполнено - закрываем модальное окно
      onCancel();
    } catch (error) {
      // Ошибка уже обработана в родительском компоненте
      // Модальное окно остается открытым для повторной попытки
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  // Минимальная дата - это текущая дата ревизии (если есть) или сегодня
  const minDate = currentAuditDate ? dayjs(currentAuditDate) : dayjs();

  return (
    <Modal
      open={open}
      title="Провести ревизию навыка"
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
          Провести ревизию
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="date"
          label="Дата ревизии"
          rules={[
            { required: true, message: 'Выберите дату ревизии' },
            {
              validator: (_, value) => {
                if (value && value.isBefore(minDate, 'day')) {
                  return Promise.reject(
                    new Error('Дата ревизии не может быть меньше текущей даты ревизии')
                  );
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Выберите дату ревизии"
            format="DD.MM.YYYY"
            disabledDate={(current) => current && current.isBefore(minDate, 'day')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MakeRevisionModal;
