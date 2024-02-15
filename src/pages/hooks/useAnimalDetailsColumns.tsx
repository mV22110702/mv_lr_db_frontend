import { ColumnDef } from "@tanstack/react-table";
import {
  AnimalFoodDetails,
  AnimalShiftDetails,
} from "@/store/animalApiSlice.ts";

export const useAnimalDetailsColumns = (): {
  feedHistoryColumns: ColumnDef<AnimalFoodDetails>[];
  shiftHistoryColumns: ColumnDef<AnimalShiftDetails>[];
} => {
  const feedHistoryColumns: ColumnDef<AnimalFoodDetails>[] = [
    {
      accessorKey: "foodId",
      header: () => <div className="text-center">Food ID</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "foodName",
      header: () => <div className="text-center">Food Name</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "keeperId",
      header: () => <div className="text-center">Keeper ID</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "keeperFullname",
      header: () => <div className="text-center">Keeper Full Name</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount (g)</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
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
  ];

  const shiftHistoryColumns: ColumnDef<AnimalShiftDetails>[] = [
    {
      accessorKey: "keeperId",
      header: () => <div className="text-center">Keeper ID</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "keeperFullname",
      header: () => <div className="text-center">Keeper Full Name</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
    {
      accessorKey: "startsAt",
      header: () => <div className="text-center">Starts At</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-center">{getValue<Date>().toISOString()}</div>
        );
      },
    },
    {
      accessorKey: "endsAt",
      header: () => <div className="text-center">Ends At</div>,
      cell: ({ getValue }) => {
        return (
          <div className="text-center">{getValue<Date>().toISOString()}</div>
        );
      },
    },
    {
      accessorKey: "salary",
      header: () => <div className="text-center">Salary</div>,
      cell: ({ getValue }) => {
        return <div className="text-center">{getValue<number>()}</div>;
      },
    },
  ];

  return { feedHistoryColumns, shiftHistoryColumns };
};
