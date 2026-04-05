import { redirect } from "next/navigation";

// Redirects to the simplified inline form at /parceiro/fornecer
export default function PartnerRegistrationPage() {
  redirect("/parceiro/fornecer");
}
