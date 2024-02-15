import { ColumnDef } from "@tanstack/react-table";
import { foodApiSlice, Food } from "@/store/foodApiSlice.ts";
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

export const useFoodColumns = (
  setChosenFoodId: React.Dispatch<number | null>,
  setOpenAddFoodDialog: React.Dispatch<boolean>,
) => {
  const [remove, result] = foodApiSlice.useRemoveFoodMutation();
  const onRemove = (id: number) => {
    remove(id);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Food removed");
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error removing food");
    }
  }, [result.isError]);
  const columns: ColumnDef<Food>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="text-center">Id</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<number>()}</div>;
        },
      },
      {
        accessorKey: "name",
        header: () => <div className="text-center">Name</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<string>()}</div>;
        },
      },
      {
        accessorKey: "restockedAt",
        header: () => <div className="text-center">Restocked At</div>,
        cell: ({ getValue }) => {
          return (
            <div className="text-center">{getValue<Date>().toISOString()}</div>
          );
        },
      },
      {
        accessorKey: "usedAt",
        header: () => <div className="text-center">Used At</div>,
        cell: ({ getValue }) => {
          return (
            <div className="text-center">{getValue<Date>().toISOString()}</div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-center">Amount</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<number>()}</div>;
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const food = row.original;

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
                      setChosenFoodId(food.id);
                      setOpenAddFoodDialog(false);
                    }}
                  >
                    <DropdownMenuItem>
                      <button className="Button">Edit</button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem onSelect={() => onRemove(food.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [setChosenFoodId],
  );
  return columns;
};
