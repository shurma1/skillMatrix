import React from 'react';
import { Form, Input, InputNumber, Button, Card, Space, Typography } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { CreateTestDTO, AnswerVariantDTO } from '@/types/api/test';

const { Title } = Typography;

interface TestFormProps {
  onSubmit: (values: CreateTestDTO) => void; // expects seconds; form handles minutes->seconds conversion
  loading?: boolean;
  // initialValues.timeLimit is expected in MINUTES (UI units)
  initialValues?: Partial<CreateTestDTO>;
}

const TestForm: React.FC<TestFormProps> = ({ 
  onSubmit, 
  loading = false, 
  initialValues 
}) => {
  const [form] = Form.useForm<CreateTestDTO>();

  const handleFinish = (values: CreateTestDTO) => {
    const minutes = Number(values.timeLimit) || 1;
    const payload: CreateTestDTO = {
      ...values,
      timeLimit: Math.round(minutes * 60), // convert minutes -> seconds for backend
    };
    onSubmit(payload);
  };

  // Следим за изменениями в количестве вопросов и корректируем needScore
  const handleQuestionsChange = () => {
    const questions = form.getFieldValue('questions') || [];
    const currentNeedScore = form.getFieldValue('needScore') || 1;
    
    if (questions.length < currentNeedScore) {
      form.setFieldValue('needScore', Math.max(1, questions.length));
    }
  };

  // Обработка выбора правильного ответа (только один может быть верным)
  const handleCorrectAnswerToggle = (questionIndex: number, answerIndex: number) => {
    const questions = form.getFieldValue('questions') || [];
    const currentQuestion = questions[questionIndex];
    
    if (currentQuestion && currentQuestion.answerVariants) {
      const currentValue = currentQuestion.answerVariants[answerIndex]?.isTrue;
      
      if (!currentValue) {
        // Если делаем ответ правильным, то все остальные делаем неправильными
        currentQuestion.answerVariants.forEach((_: AnswerVariantDTO, idx: number) => {
          form.setFieldValue(
            ['questions', questionIndex, 'answerVariants', idx, 'isTrue'], 
            idx === answerIndex
          );
        });
        
        // Принудительно обновляем форму для ререндера
        form.setFieldsValue(form.getFieldsValue());
      }
      // Если ответ уже верный (currentValue === true), ничего не делаем
    }
  };

  // Обработка удаления варианта ответа с проверкой правильного ответа
  const handleRemoveAnswer = (questionIndex: number, answerIndex: number, removeAnswer: (index: number) => void) => {
    const questions = form.getFieldValue('questions') || [];
    const currentQuestion = questions[questionIndex];
    
    if (currentQuestion && currentQuestion.answerVariants) {
      const wasCorrect = currentQuestion.answerVariants[answerIndex]?.isTrue;
      
      // Удаляем ответ
      removeAnswer(answerIndex);
      
      // Если удаленный ответ был правильным, делаем первый оставшийся ответ правильным
      if (wasCorrect) {
        setTimeout(() => {
          // Используем setTimeout чтобы дождаться обновления формы после удаления
          const updatedQuestions = form.getFieldValue('questions') || [];
          const updatedQuestion = updatedQuestions[questionIndex];
          
          if (updatedQuestion && updatedQuestion.answerVariants && updatedQuestion.answerVariants.length > 0) {
            // Проверяем, есть ли еще правильные ответы
            const hasCorrectAnswer = updatedQuestion.answerVariants.some((answer: AnswerVariantDTO) => answer.isTrue);
            
            if (!hasCorrectAnswer) {
              // Если нет правильных ответов, делаем первый правильным
              form.setFieldValue(['questions', questionIndex, 'answerVariants', 0, 'isTrue'], true);
              form.setFieldsValue(form.getFieldsValue());
            }
          }
        }, 0);
      }
    }
  };

  return (
    <Card>
    
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleFinish}
        initialValues={{
          needScore: 1,
          // default 1 minute in UI
          timeLimit: 1,
          title: '',
          questions: [
            {
              text: '',
              answerVariants: [
                { text: '', isTrue: true },
                { text: '', isTrue: false }
              ]
            }
          ],
          ...initialValues
        }}
        onValuesChange={handleQuestionsChange}
      >
        <Form.Item 
          name="title" 
          label="Название теста" 
          rules={[
            { required: true, message: 'Введите название теста' },
            { min: 3, message: 'Название должно содержать минимум 3 символа' }
          ]}
        >
          <Input placeholder="Введите название теста" />
        </Form.Item>

        <Form.Item 
          name="needScore" 
          label="Необходимый балл для прохождения" 
          rules={[
            { required: true, message: 'Укажите необходимый балл' },
            { type: 'number', min: 1, message: 'Балл должен быть больше 0' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const questions = getFieldValue('questions') || [];
                if (value && value > questions.length) {
                  return Promise.reject(
                    new Error(`Балл не может быть больше количества вопросов (${questions.length})`)
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber 
            min={1} 
            style={{ width: '100%' }} 
            placeholder="Необходимый балл"
          />
        </Form.Item>

        <Form.Item 
          name="timeLimit" 
          label="Лимит времени (минуты)" 
          rules={[
            { required: true, message: 'Укажите лимит времени' },
            { type: 'number', min: 1, message: 'Время должно быть минимум 1 минута' }
          ]}
        >
          <InputNumber 
            min={1}
            style={{ width: '100%' }} 
            placeholder="Лимит времени в минутах"
          />
        </Form.Item>

        <Form.List name="questions">
          {(fields, { add, remove }) => (
            <>
              <div style={{ 
                marginBottom: 16 
              }}>
                <Title level={4}>Вопросы</Title>
              </div>

              {fields.map(({ key, name, ...restField }) => (
                <Card 
                  key={key} 
                  size="small" 
                  title={`Вопрос ${name + 1}`}
                  extra={
                    fields.length > 1 && (
                      <PermissionButton
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          remove(name);
                          handleQuestionsChange();
                        }}
                      >
                        Удалить
                      </PermissionButton>
                    )
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'text']}
                    label="Текст вопроса"
                    rules={[
                      { required: true, message: 'Введите текст вопроса' },
                      { min: 5, message: 'Вопрос должен содержать минимум 5 символов' }
                    ]}
                  >
                    <Input.TextArea 
                      placeholder="Введите текст вопроса" 
                      rows={2}
                    />
                  </Form.Item>

                  <Form.List name={[name, 'answerVariants']}>
                    {(answerFields, { add: addAnswer, remove: removeAnswer }) => (
                      <>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: 8 
                        }}>
                          <span>Варианты ответов:</span>
                          <PermissionButton
                            type="dashed"
                            size="small"
                            onClick={() => addAnswer({ text: '', isTrue: false })}
                            icon={<PlusOutlined />}
                          >
                            Добавить вариант
                          </PermissionButton>
                        </div>

                        {answerFields.map(({ key: answerKey, name: answerName, ...answerRestField }) => (
                          <div key={answerKey} style={{ marginBottom: 8 }}>
                            <Space.Compact style={{ width: '100%' }}>
                              <Form.Item
                                {...answerRestField}
                                name={[answerName, 'text']}
                                style={{ flex: 1, marginBottom: 0 }}
                                rules={[
                                  { required: true, message: 'Введите текст ответа' }
                                ]}
                              >
                                <Input placeholder="Текст варианта ответа" />
                              </Form.Item>
                              
                              <Form.Item
                                {...answerRestField}
                                name={[answerName, 'isTrue']}
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                              >
                                <Button
                                  type={form.getFieldValue(['questions', name, 'answerVariants', answerName, 'isTrue']) ? 'primary' : 'default'}
                                  onClick={() => handleCorrectAnswerToggle(name, answerName)}
                                >
                                  {form.getFieldValue(['questions', name, 'answerVariants', answerName, 'isTrue']) ? 'Верный' : 'Неверный'}
                                </Button>
                              </Form.Item>

                              {answerFields.length > 2 && (
                                <PermissionButton
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => handleRemoveAnswer(name, answerName, removeAnswer)}
                                />
                              )}
                            </Space.Compact>
                          </div>
                        ))}

                        {/* Валидация: хотя бы один правильный ответ */}
                        <Form.Item
                          name={[name, 'hasCorrectAnswer']}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator() {
                                const currentQuestion = getFieldValue(['questions', name]);
                                const hasCorrect = currentQuestion?.answerVariants?.some(
                                  (answer: AnswerVariantDTO) => answer.isTrue
                                );
                                if (!hasCorrect) {
                                  return Promise.reject(
                                    new Error('Выберите хотя бы один правильный ответ')
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <div />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <PermissionButton
                  type="dashed"
                  onClick={() => add({
                    text: '',
                    answerVariants: [
                      { text: '', isTrue: true },
                      { text: '', isTrue: false }
                    ]
                  })}
                  icon={<PlusOutlined />}
                  size="large"
                >
                  Добавить вопрос
                </PermissionButton>
              </div>
            </>
          )}
        </Form.List>

        <Form.Item>
          <PermissionButton 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
          >
            {initialValues ? 'Сохранить изменения' : 'Создать тест'}
          </PermissionButton>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TestForm;
