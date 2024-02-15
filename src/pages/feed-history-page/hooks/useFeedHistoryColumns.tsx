import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog.tsx";
import { toast } from "sonner";
import {
  feedHistoryApiSlice,
  FeedHistory,
  FindFeedHistoryDto,
} from "@/store/feedHistoryApiSlice.ts";

export const useFeedHistoryColumns = (
  setChosenFeedHistoryId: React.Dispatch<FindFeedHistoryDto | null>,
  setOpenAddFeedHistoryDialog: React.Dispatch<boolean>,
) => {
  const [remove, result] = feedHistoryApiSlice.useRemoveFeedHistoryMutation();
  const onRemove = (id: FindFeedHistoryDto) => {
    remove(id);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Feed history removed");
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error removing feed history");
    }
  }, [result.isError]);
  const columns: ColumnDef<FeedHistory>[] = useMemo(
    () => [
      {
        id: "animalId",
        accessorKey: "animal",
        header: () => <div className="text-center">Animal ID</div>,
        cell: ({ row }) => {
          return <div className="text-center">{row.original.animal.id}</div>;
        },
      },
      {
        id: "animalName",
        accessorKey: "animal",
        header: () => (
          <div className="text-center">Animal Name (Scientific)</div>
        ),
        cell: ({ row }) => {
          return (
            <div className="text-center">
              {row.original.animal.name} ({row.original.animal.scientificName})
            </div>
          );
        },
      },
      {
        id: "keeperId",
        accessorKey: "keeper",
        header: () => <div className="text-center">Keeper ID</div>,
        cell: ({ row }) => {
          return <div className="text-center">{row.original.keeper.id}</div>;
        },
      },
      {
        id: "keeperName",
        accessorKey: "keeper",
        header: () => <div className="text-center">Keeper Full Name</div>,
        cell: ({ row }) => {
          return (
            <div className="text-center">
              {row.original.keeper.firstName} {row.original.keeper.lastName}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="text-center">Created At</div>,
        cell: ({ getValue }) => {
          return (
            <div className="text-center">{getValue<Date>().toISOString()}</div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const feedHistory = row.original;

          return (
            <div className={"flex place-content-center"}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className={"m-auto"}>
                  <Button variant="ghost" className="h-8 w-8 p-0 m-auto">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"w-500"} align="center">
                  <DialogTrigger
                    asChild
                    onClick={() => {
                      setChosenFeedHistoryId({
                        animalId: feedHistory.animal.id,
                        keeperId: feedHistory.keeper.id,
                        createdAt: feedHistory.createdAt,
                      });
                      setOpenAddFeedHistoryDialog(false);
                    }}
                  >
                    <DropdownMenuItem>
                      <button className="Button violet">Edit</button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem
                    onSelect={() =>
                      onRemove({
                        animalId: feedHistory.animal.id,
                        keeperId: feedHistory.keeper.id,
                        createdAt: feedHistory.createdAt,
                      })
                    }
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [setChosenFeedHistoryId],
  );
  return columns;
};
