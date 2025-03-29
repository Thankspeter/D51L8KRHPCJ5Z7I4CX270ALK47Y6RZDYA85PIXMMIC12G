import AdminUpdateForm from "./Form";

export default function SettingsPage() {
  return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex justify-center items-center min-h-[50vh]">
          <AdminUpdateForm className="bg-muted/50 aspect-video rounded-xl" />
        </div>
      </div>
  );
}