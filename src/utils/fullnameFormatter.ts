import { Fullname } from "models/fullname";
export interface FullnameFormatter {
  [key: string]: string;
}

export const fullnameFormatter = ({
  firstName,
  middleName,
  lastName,
}: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) => {
  if (middleName) {
    return `${firstName || ""} ${middleName} ${lastName || ""}`;
  } else {
    return `${firstName || ""} ${lastName || ""}`;
  }
};

export const fullnameFormatterWithLang = (nameObj: Fullname) => {
  const fullnameObj = { ...nameObj } as FullnameFormatter;
  let useLang;
  if (nameObj.lang === "th" && nameObj.firstNameTH) {
    useLang = "TH";
  } else {
    useLang = "EN";
  }

  return fullnameFormatter({
    firstName: fullnameObj[`firstName${useLang}`],
    middleName: fullnameObj[`middleName${useLang}`],
    lastName: fullnameObj[`lastName${useLang}`],
  });
};
