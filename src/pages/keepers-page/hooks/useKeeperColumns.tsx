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
import { keeperApiSlice, ZooKeeper } from "@/store/keeperApiSlice.ts";

export const useKeeperColumns = (
  setChosenKeeperId: React.Dispatch<number | null>,
  setOpenAddKeeperDialog: React.Dispatch<boolean>,
) => {
  const [remove, result] = keeperApiSlice.useRemoveKeeperMutation();
  const onRemove = (id: number) => {
    remove(id);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Keeper removed");
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error removing keeper");
    }
  }, [result.isError]);
  const columns: ColumnDef<ZooKeeper>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="text-center">Id</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<number>()}</div>;
        },
      },
      {
        accessorKey: "firstName",
        header: () => <div className="text-center">First name</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<string>()}</div>;
        },
      },
      {
        accessorKey: "lastName",
        header: () => <div className="text-center">Last name</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<string>()}</div>;
        },
      },
      {
        id: "shiftCount",
        header: () => <div className="text-center">Shifts count</div>,
        cell: ({ row }) => {
          const keeper = row.original;
          const { data, isLoading, isError } =
            keeperApiSlice.useGetShiftsCountByIdQuery(keeper.id);
          return (
            <div className="text-center">
              {isError ? "-" : isLoading ? "Loading..." : data?.shiftsCount}
            </div>
          );
        },
      },

      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const keeper = row.original;

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
                      setChosenKeeperId(keeper.id);
                      setOpenAddKeeperDialog(false);
                    }}
                  >
                    <DropdownMenuItem>
                      <button className="Button violet">Edit</button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem onSelect={() => onRemove(keeper.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [setChosenKeeperId],
  );
  return columns;
};
