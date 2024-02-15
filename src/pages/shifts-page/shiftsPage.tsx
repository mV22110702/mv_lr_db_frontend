import { FC, useState } from "react";
import { DataTable } from "@/components/data-table/data-table.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";
import { ShiftAnimalKeeperId, shiftApiSlice } from "@/store/shiftApiSlice.ts";
import { useShiftColumns } from "@/pages/shifts-page/hooks/useShiftColumns.tsx";
import { ChangeShiftDialogForm } from "@/pages/shifts-page/components/change-shift-dialog-form.tsx";
import { AddShiftDialogForm } from "@/pages/shifts-page/components/add-shift-dialog-form.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

export const ShiftsPage: FC = () => {
  const { data, error, isError, isLoading } =
    shiftApiSlice.useGetAllShiftsQuery();
  const [chosenShiftId, setChosenShiftId] =
    useState<ShiftAnimalKeeperId | null>(null);
  const [openAddShiftDialog, setOpenAddShiftDialog] = useState(false);
  const columns = useShiftColumns(setChosenShiftId, setOpenAddShiftDialog);
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  } else {
    content = <DataTable columns={columns} data={data!} />;
  }
const handleClose = ()=>{
    if (chosenShiftId) {
        setChosenShiftId(null);
    } else if (openAddShiftDialog) {
        setOpenAddShiftDialog(false);
    }
}
  return (
    <Dialog open={!!chosenShiftId || openAddShiftDialog}>
      <div
        className={
          "p-12 pt-2 w-full h-full flex-column justify-center items-center"
        }
      >
        <h1 className="text-center text-3xl font-bold">Shifts</h1>
        <div>{content}</div>

        <ScrollArea>
          <DialogContent onClose={handleClose}>
            {!openAddShiftDialog ? (
              <ShiftPageChangeDialogContent
                chosenShiftId={chosenShiftId}
                setChosenShiftId={setChosenShiftId}
              />
            ) : (
              <ShiftPageAddDialogContent
                setOpenAddShiftDialog={setOpenAddShiftDialog}
              />
            )}
          </DialogContent>
        </ScrollArea>
      </div>
      <DialogTrigger asChild onClick={() => setOpenAddShiftDialog(true)}>
        <Button className={"rounded-full size-50 fixed right-3 bottom-3"}>
          <PlusIcon className="rounded-full" />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

const ShiftPageAddDialogContent = ({
  setOpenAddShiftDialog,
}: {
  setOpenAddShiftDialog: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add shift</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <AddShiftDialogForm setOpenAddShiftDialog={setOpenAddShiftDialog} />
    </>
  );
};

const ShiftPageChangeDialogContent = ({
  chosenShiftId,
  setChosenShiftId,
}: {
  chosenShiftId: ShiftAnimalKeeperId | null;
  setChosenShiftId: React.Dispatch<ShiftAnimalKeeperId | null>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit shift</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>{" "}
      {!chosenShiftId ? (
        <Skeleton className="h-4 w-[250px]" />
      ) : (
        <ChangeShiftDialogForm
          shiftId={chosenShiftId}
          setShiftId={setChosenShiftId}
        />
      )}
    </>
  );
};
