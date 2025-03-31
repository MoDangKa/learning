import th from "antd/es/date-picker/locale/th_TH";
import thTH from "antd/es/locale/th_TH";

export const buddhistLocale: typeof th = {
  ...th,
  lang: {
    ...th.lang,
    fieldDateFormat: "BBBB-MM-DD",
    fieldDateTimeFormat: "BBBB-MM-DD HH:mm:ss",
    yearFormat: "BBBB",
    cellYearFormat: "BBBB",
  },
};

export const globalBuddhistLocale: typeof thTH = {
  ...thTH,
  DatePicker: {
    ...thTH.DatePicker!,
    lang: buddhistLocale.lang,
  },
};
