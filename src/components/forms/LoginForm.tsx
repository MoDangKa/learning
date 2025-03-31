"use client";
import apiService from "@/lib/apiService";
import { NotiType } from "@/lib/enums";
import "@ant-design/v5-patch-for-react-19";
import { Button, Form, Input, notification } from "antd";
import { useRouter } from "next/navigation";

type FieldType = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message: string, type: NotiType) => {
    api[type]({
      message,
      placement: "topRight",
    });
  };

  function onReset() {
    form.resetFields();
  }

  async function onFinish(values: FieldType) {
    const { success, statusText } = await apiService({
      url: "/api/login",
      method: "POST",
      data: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    if (success) {
      router.push("/");
      openNotification(statusText, NotiType.SUCCESS);
    } else {
      openNotification(statusText, NotiType.ERROR);
      onReset();
    }
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="login-form"
        className="ant-form__custom flex flex-col gap-2 p-5 max-w-xs w-full basic-card"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h1 className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Login Form
        </h1>
        <hr className="my-3" />
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
        </div>
        <div className="mt-5">
          <Button type="primary" htmlType="submit" className="w-full">
            เข้าสู่ระบบ
          </Button>
        </div>
      </Form>
    </>
  );
}
