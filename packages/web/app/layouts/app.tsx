import { Outlet } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";

export default function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
} 