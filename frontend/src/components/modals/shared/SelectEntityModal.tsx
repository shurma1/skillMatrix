import React from 'react';
import { Modal, Form, Select } from 'antd';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BaseProps {
  open: boolean;
  title: string;
  okText: string;
  fieldLabel: string;
  options: SelectOption[];
  onCancel: () => void;
  confirmLoading?: boolean;
}

interface SingleSelectProps extends BaseProps {
  mode?: 'single';
  onSubmit: (value: string) => void;
}

interface SingleWithExtraNumberProps extends BaseProps {
  mode: 'withNumber';
  numberFieldLabel: string;
  numberInitial?: number;
  numberMin?: number;
  numberMax?: number;
  onSubmit: (value: string, num: number) => void;
}

export type SelectEntityModalProps = SingleSelectProps | SingleWithExtraNumberProps;

const SelectEntityModal: React.FC<SelectEntityModalProps> = (props) => {
  const [form] = Form.useForm();
  const {
    open,
    title,
    okText,
    fieldLabel,
    options,
    onCancel,
    confirmLoading,
  } = props;

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (props.mode === 'withNumber') {
        props.onSubmit(values.entityId, values.extraNumber);
      } else {
        props.onSubmit(values.entityId);
      }
    } catch {
      // Validation errors ignored
    }
  };

  const initialValues = props.mode === 'withNumber'
    ? { extraNumber: props.numberInitial ?? 1 }
    : undefined;

  return (
    <Modal
      open={open}
      title={title}
  okText={okText}
  cancelText="Отмена"
  onCancel={onCancel}
  confirmLoading={confirmLoading}
  onOk={handleOk}
	  destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="entityId"
          label={fieldLabel}
          rules={[{ required: true, message: `Выберите ${fieldLabel.toLowerCase()}` }]}
        >
          <Select
            showSearch
            placeholder={`Выберите ${fieldLabel.toLowerCase()}`}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={options}
          />
        </Form.Item>
        {props.mode === 'withNumber' && (
          <Form.Item
            name="extraNumber"
            label={props.numberFieldLabel}
            rules={[{ required: true, message: `Укажите ${props.numberFieldLabel.toLowerCase()}` }]}
          >
            <Select
              options={Array.from(
                { length: (props.numberMax || 5) - (props.numberMin || 1) + 1 },
                (_, i) => {
                  const value = (props.numberMin || 1) + i;
                  return { value, label: value };
                }
              )}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SelectEntityModal;
