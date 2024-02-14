import { FC, useState } from "react";
import { animalApiSlice } from "@/store/animalApiSlice.ts";
import { DataTable } from "@/components/data-table/data-table.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { ChangeAnimalDialogForm } from "@/pages/components/change-animal-dialog-form.tsx";
import { useAnimalColumns } from "@/pages/hooks/useAnimalColumns.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";
import { AddAnimalDialogForm } from "@/pages/components/add-animal-dialog-form.tsx";

export const AnimalsPage: FC = () => {
  const { data, error, isError, isLoading } = animalApiSlice.useGetAllQuery();
  const [chosenAnimalId, setChosenAnimalId] = useState<number | null>(null);
  const [openAddAnimalDialog, setOpenAddAnimalDialog] = useState(false);
  const columns = useAnimalColumns(setChosenAnimalId, setOpenAddAnimalDialog);
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  } else {
    content = <DataTable columns={columns} data={data!} />;
  }

  return (
    <Dialog>
      <div
        className={
          "p-12 pt-2 w-full h-full flex-column justify-center items-center"
        }
      >
        <h1 className="text-center text-3xl font-bold">Animals</h1>
        <div>{content}</div>

        <DialogContent
        >
          {!openAddAnimalDialog ? (
            <AnimalPageChangeDialogContent
              chosenAnimalId={chosenAnimalId}
              setChosenAnimalId={setChosenAnimalId}
            />
          ) : (
            <AnimalPageAddDialogContent
              setOpenAddAnimalDialog={setOpenAddAnimalDialog}
            />
          )}
        </DialogContent>
      </div>
      <DialogTrigger asChild onClick={() => setOpenAddAnimalDialog(true)}>
        <Button className={"rounded-full size-50 fixed right-3 bottom-3"}>
          <PlusIcon className="rounded-full" />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

const AnimalPageAddDialogContent = ({
  setOpenAddAnimalDialog,
}: {
  setOpenAddAnimalDialog: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add animal</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <AddAnimalDialogForm setOpenAddAnimalDialog={setOpenAddAnimalDialog} />
    </>
  );
};

const AnimalPageChangeDialogContent = ({
  chosenAnimalId,
  setChosenAnimalId,
}: {
  chosenAnimalId: number | null;
  setChosenAnimalId: React.Dispatch<number | null>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit animal</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>{" "}
      {!chosenAnimalId ? (
        <Skeleton className="h-4 w-[250px]" />
      ) : (
        <ChangeAnimalDialogForm
          animalId={chosenAnimalId}
          setAnimalId={setChosenAnimalId}
        />
      )}
    </>
  );
};
