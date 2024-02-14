import { ColumnDef } from "@tanstack/react-table";
import { animalApiSlice, ZooAnimal } from "@/store/animalApiSlice.ts";
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

export const useAnimalColumns = (
  setChosenAnimalId: React.Dispatch<number | null>,
  setOpenAddAnimalDialog: React.Dispatch<boolean>,
) => {
  const [remove, result] = animalApiSlice.useRemoveMutation();
  const onRemove = (id: number) => {
    remove(id);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Animal removed");
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error removing animal");
    }
  }, [result.isError]);
  const columns: ColumnDef<ZooAnimal>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: () => <div className="text-center">Id</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<number>()}</div>;
        },
      },
      {
        accessorKey: "scientificName",
        header: () => <div className="text-center">Scientific name</div>,
        cell: ({ getValue }) => {
          return <div className="text-center">{getValue<string>()}</div>;
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
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
          const animal = row.original;

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
                      setChosenAnimalId(animal.id);
                      setOpenAddAnimalDialog(false);
                    }}
                  >
                    <DropdownMenuItem>
                      <button className="Button violet">Edit</button>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DropdownMenuItem onSelect={() => onRemove(animal.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [setChosenAnimalId],
  );
  return columns;
};
