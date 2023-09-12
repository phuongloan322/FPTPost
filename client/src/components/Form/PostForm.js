import React, { useState } from 'react';
import { Button, Form, Input, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const FormPost = (props) => {
  const { onSubmit, processing = false, isEdit } = props;
  const [payload, setPayload] = useState({
    title: '',
    file: null,
  });
  const onFinish = (values) => {
    const { title } = values;
    onSubmit({ title, image: payload.file });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFileChange = async (e) => {
    const file = e.fileList[0];
    setPayload({ ...payload, file: file.originFileObj });
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Post's name"
        name="title"
        rules={[
          {
            required: isEdit ? false : true,
            message: 'Input name empty.Please fill it!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
        <Upload onChange={onFileChange} beforeUpload={() => false} listType="picture-card">
          <div>
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              Up Image
            </div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit" loading={processing}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormPost;
