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
import { keeperApiSlice } from "@/store/keeperApiSlice.ts";
import { useKeeperColumns } from "@/pages/keepers-page/hooks/useKeeperColumns.tsx";
import { ChangeKeeperDialogForm } from "@/pages/keepers-page/components/change-keeper-dialog-form.tsx";
import { AddKeeperDialogForm } from "@/pages/keepers-page/components/add-keeper-dialog-form.tsx";

export const KeepersPage: FC = () => {
  const { data, error, isError, isLoading } = keeperApiSlice.useGetAllKeepersQuery();
  const [chosenKeeperId, setChosenKeeperId] = useState<number | null>(null);
  const [openAddKeeperDialog, setOpenAddKeeperDialog] = useState(false);
  const columns = useKeeperColumns(setChosenKeeperId, setOpenAddKeeperDialog);
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  } else {
    content = <DataTable columns={columns} data={data!} />;
  }

  return (
    <Dialog open={!!chosenKeeperId || openAddKeeperDialog}>
      <div
        className={
          "p-12 pt-2 w-full h-full flex-column justify-center items-center"
        }
      >
        <h1 className="text-center text-3xl font-bold">Keepers</h1>
        <div>{content}</div>

        <DialogContent>
          {!openAddKeeperDialog ? (
            <KeeperPageChangeDialogContent
              chosenKeeperId={chosenKeeperId}
              setChosenKeeperId={setChosenKeeperId}
            />
          ) : (
            <KeeperPageAddDialogContent
              setOpenAddKeeperDialog={setOpenAddKeeperDialog}
            />
          )}
        </DialogContent>
      </div>
      <DialogTrigger asChild onClick={() => setOpenAddKeeperDialog(true)}>
        <Button className={"rounded-full size-50 fixed right-3 bottom-3"}>
          <PlusIcon className="rounded-full" />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

const KeeperPageAddDialogContent = ({
  setOpenAddKeeperDialog,
}: {
  setOpenAddKeeperDialog: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add keeper</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <AddKeeperDialogForm setOpenAddKeeperDialog={setOpenAddKeeperDialog} />
    </>
  );
};

const KeeperPageChangeDialogContent = ({
  chosenKeeperId,
  setChosenKeeperId,
}: {
  chosenKeeperId: number | null;
  setChosenKeeperId: React.Dispatch<number | null>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit keeper</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>{" "}
      {!chosenKeeperId ? (
        <Skeleton className="h-4 w-[250px]" />
      ) : (
        <ChangeKeeperDialogForm
          keeperId={chosenKeeperId}
          setKeeperId={setChosenKeeperId}
        />
      )}
    </>
  );
};
