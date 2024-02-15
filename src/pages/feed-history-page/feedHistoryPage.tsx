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
import { FindFeedHistoryDto, feedHistoryApiSlice } from "@/store/feedHistoryApiSlice.ts";
import { useFeedHistoryColumns } from "@/pages/feed-history-page/hooks/useFeedHistoryColumns.tsx";
import { ChangeFeedHistoryDialogForm } from "@/pages/feed-history-page/components/change-feed-history-dialog-form.tsx";
import { AddFeedHistoryDialogForm } from "@/pages/feed-history-page/components/add-feed-history-dialog-form.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

export const FeedHistoryPage: FC = () => {
  const { data, error, isError, isLoading } =
    feedHistoryApiSlice.useGetAllFeedHistoriesQuery(undefined);
  const [chosenFeedHistoryId, setChosenFeedHistoryId] =
    useState<FindFeedHistoryDto | null>(null);
  const [openAddFeedHistoryDialog, setOpenAddFeedHistoryDialog] = useState(false);
  const columns = useFeedHistoryColumns(setChosenFeedHistoryId, setOpenAddFeedHistoryDialog);
  let content;
  if (isLoading) {
    content = <div>Loading...</div>;
  } else if (isError) {
    content = <div>Error: {JSON.stringify(error)}</div>;
  } else {
    content = <DataTable columns={columns} data={data!} />;
  }
const handleClose = ()=>{
    if (chosenFeedHistoryId) {
        setChosenFeedHistoryId(null);
    } else if (openAddFeedHistoryDialog) {
        setOpenAddFeedHistoryDialog(false);
    }
}
  return (
    <Dialog open={!!chosenFeedHistoryId || openAddFeedHistoryDialog}>
      <div
        className={
          "p-12 pt-2 w-full h-full flex-column justify-center items-center"
        }
      >
        <h1 className="text-center text-3xl font-bold">Feed Histories</h1>
        <div>{content}</div>

        <ScrollArea>
          <DialogContent onClose={handleClose}>
            {!openAddFeedHistoryDialog ? (
              <FeedHistoryPageChangeDialogContent
                chosenFeedHistoryId={chosenFeedHistoryId}
                setChosenFeedHistoryId={setChosenFeedHistoryId}
              />
            ) : (
              <FeedHistoryPageAddDialogContent
                setOpenAddFeedHistoryDialog={setOpenAddFeedHistoryDialog}
              />
            )}
          </DialogContent>
        </ScrollArea>
      </div>
      <DialogTrigger asChild onClick={() => setOpenAddFeedHistoryDialog(true)}>
        <Button className={"rounded-full size-50 fixed right-3 bottom-3"}>
          <PlusIcon className="rounded-full" />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

const FeedHistoryPageAddDialogContent = ({
  setOpenAddFeedHistoryDialog,
}: {
  setOpenAddFeedHistoryDialog: React.Dispatch<boolean>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add feed history</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <AddFeedHistoryDialogForm setOpenAddFeedHistoryDialog={setOpenAddFeedHistoryDialog} />
    </>
  );
};

const FeedHistoryPageChangeDialogContent = ({
  chosenFeedHistoryId,
  setChosenFeedHistoryId,
}: {
  chosenFeedHistoryId: FindFeedHistoryDto | null;
  setChosenFeedHistoryId: React.Dispatch<FindFeedHistoryDto | null>;
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit feed history</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>{" "}
      {!chosenFeedHistoryId ? (
        <Skeleton className="h-4 w-[250px]" />
      ) : (
        <ChangeFeedHistoryDialogForm
          feedHistoryId={chosenFeedHistoryId}
          setFeedHistoryId={setChosenFeedHistoryId}
        />
      )}
    </>
  );
};
