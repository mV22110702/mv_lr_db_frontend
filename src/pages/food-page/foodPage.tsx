import { FC, useState } from "react";
import { foodApiSlice } from "@/store/foodApiSlice.ts";
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
import { ChangeFoodDialogForm } from "@/pages/food-page/components/change-food-dialog-form.tsx";
import { useFoodColumns } from "@/pages/food-page/hooks/useFoodColumns.tsx";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.tsx";
import { AddFoodDialogForm } from "@/pages/food-page/components/add-food-dialog-form.tsx";

export const FoodPage: FC = () => {
  const { data, error, isError, isLoading } =
    foodApiSlice.useGetAllFoodsQuery();
  const [chosenFoodId, setChosenFoodId] = useState<number | null>(null);
  const [openAddFoodDialog, setOpenAddFoodDialog] = useState(false);
  const columns = useFoodColumns(setChosenFoodId, setOpenAddFoodDialog);
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  } else {
    content = <DataTable columns={columns} data={data!} />;
  }
  const handleClose = () => {
    if (chosenFoodId) {
      setChosenFoodId(null);
    } else if (openAddFoodDialog) {
      setOpenAddFoodDialog(false);
    }
  };
  return (
    <Dialog open={!!chosenFoodId || openAddFoodDialog}>
      <div
        className={
          "p-12 pt-2 w-full h-full flex-column justify-center items-center"
        }
      >
        <h1 className="text-center text-3xl font-bold">Foods</h1>
        <div>{content}</div>

        <DialogContent onClose={handleClose}>
          {!openAddFoodDialog ? (
            <FoodPageChangeDialogContent
              chosenFoodId={chosenFoodId}
              setChosenFoodId={setChosenFoodId}
            />
          ) : (
            <FoodPageAddDialogContent
              setOpenAddFoodDialog={setOpenAddFoodDialog}
            />
          )}
        </DialogContent>
      </div>
      <DialogTrigger asChild onClick={() => setOpenAddFoodDialog(true)}>
        <Button className={"rounded-full size-50 fixed right-3 bottom-3"}>
          <PlusIcon className="rounded-full" />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

const FoodPageAddDialogContent = ({
  setOpenAddFoodDialog,
}: {
  setOpenAddFoodDialog: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add food</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <AddFoodDialogForm setOpenAddFoodDialog={setOpenAddFoodDialog} />
    </>
  );
};

const FoodPageChangeDialogContent = ({
  chosenFoodId,
  setChosenFoodId,
}: {
  chosenFoodId: number | null;
  setChosenFoodId: React.Dispatch<number | null>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit food</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>{" "}
      {!chosenFoodId ? (
        <Skeleton className="h-4 w-[250px]" />
      ) : (
        <ChangeFoodDialogForm
          foodId={chosenFoodId}
          setFoodId={setChosenFoodId}
        />
      )}
    </>
  );
};
