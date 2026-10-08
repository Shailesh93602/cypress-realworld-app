import { string, object, mixed } from "yup";
import { DefaultPrivacyLevel } from "../models";

const DefaultPrivacyLevelValues = Object.values(DefaultPrivacyLevel);

export const userSettingsValidationSchema = object({
  firstName: string().required("Enter a first name"),
  lastName: string().required("Enter a last name"),
  email: string().email("Must contain a valid email address").required("Enter an email address"),
  jobTitle: string().required("Enter a job title"),
  defaultPrivacyLevel: mixed<DefaultPrivacyLevel>().oneOf(DefaultPrivacyLevelValues),
});
