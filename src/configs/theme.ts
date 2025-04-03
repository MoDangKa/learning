import { ThemeConfig } from "antd";

export const themeConfig: ThemeConfig = {
  token: {
    fontFamily: "var(--font-prompt)",
    fontSize: 16,
  },
  components: {
    Button: {
      fontWeight: 300,
      controlHeight: 40,
      // borderRadius: 4,
      controlHeightSM: 24,
      // borderRadiusSM: 4,

      // colorPrimary: "var(--slate-700)",
      // colorPrimaryHover: "var(--purple-color-05)",
      // colorPrimaryActive: "var(--purple-color-02)",
      // colorText: "var(--purple-color-04)",
      // colorBorder: "var(--purple-color-06)",
    },
    Input: {
      controlHeight: 40,
      // colorBgContainer: "var(--slate-700)",
      colorBorder: "var(--slate-500)",
    },
    Select: { controlHeight: 52, borderRadius: 8 },
    DatePicker: { controlHeight: 52, borderRadius: 8 },
    Pagination: {
      // colorPrimary: "var(--purple-color-04)",
      // colorPrimaryHover: "var(--purple-color-05)",
      // colorPrimaryActive: "var(--purple-color-02)",
    },
    Modal: {
      borderRadiusLG: 16,
      paddingContentHorizontalLG: 0,
      paddingMD: 0,
    },
    Table: {
      // colorText: "var(--text-color-01)",
    },
    Anchor: {
      colorText: "white",
    },
  },
};
