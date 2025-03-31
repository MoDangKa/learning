"use client";
import apiService from "@/lib/apiService";
import "@ant-design/v5-patch-for-react-19";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type FieldType = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();

  function onReset() {
    form.resetFields();
  }

  async function onFinish(values: FieldType) {
    const { success, statusText } = await apiService({
      url: "/api/register",
      method: "POST",
      data: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    });

    if (success) {
      router.push("/");
      toast.success(statusText);
    } else {
      toast.error(statusText);
      onReset();
    }
  }

  return (
    <Form
      form={form}
      name="register-form"
      className="ant-form__custom flex flex-col gap-2 p-5 max-w-xs w-full basic-card"
      layout="vertical"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <h1 className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Register Form
      </h1>
      <hr className="my-3" />
      <div>
        <Form.Item<FieldType>
          label="ชื่อ-นามสกุล"
          name="name"
          className="ant-form-item__custom"
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อ-นามสกุล",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </div>
      <hr className="mb-3" />
      <div>
        <Form.Item<FieldType>
          label="ชื่อผู้ใช้"
          name="email"
          className="ant-form-item__custom"
          rules={[
            {
              required: true,
              message: "กรุณากรอกชื่อผู้ใช้",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="รหัสผ่าน"
          name="password"
          className="ant-form-item__custom"
          rules={[
            {
              required: true,
              message: "กรุณากรอกรหัสผ่าน",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          className="ant-form-item__custom"
          rules={[
            {
              required: true,
              message: "กรุณากรอกยืนยันรหัสผ่าน",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("รหัสผ่านไม่ตรงกัน"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </div>
      <div className="mt-5">
        <Button type="primary" htmlType="submit" className="w-full">
          สมัคร
        </Button>
      </div>
    </Form>
  );
}
