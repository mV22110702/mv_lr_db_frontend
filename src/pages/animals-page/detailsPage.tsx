import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "@/lib/enums/app-route.enum.ts";
import { useEffect } from "react";
import { animalApiSlice } from "@/store/animalApiSlice.ts";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table.tsx";
import { useAnimalDetailsColumns } from "@/pages/animals-page/hooks/useAnimalDetailsColumns.tsx";

export const DetailsPage = () => {
  const params = useParams<{ id: string }>();
  const [getDetails, { data, isSuccess, isError }] =
    animalApiSlice.useLazyGetAnimalDetailsByIdQuery();
  const navigate = useNavigate();
  const { shiftHistoryColumns, feedHistoryColumns } = useAnimalDetailsColumns();
  let content = null;
  if (params.id) {
    content = <div>Loading...</div>;
  }
  useEffect(() => {
    if (!params.id) {
      navigate(AppRoute.ROOT);
      return;
    }
    getDetails(Number.parseInt(params.id));
  }, [params.id]);
  useEffect(() => {
    if (isError) {
      toast.error("Error getting animal details");
    }
  }, [isError]);
  if (isSuccess) {
    content = (
      <div>
        <h2 className={'text-center text-xl my-7 font-bold'}>Feed history details</h2>
        <DataTable columns={feedHistoryColumns} data={data![0]} />
        <div className={'my-10'}></div>
        <h2 className={'text-center text-xl my-7 font-bold'}>Shift history details</h2>
        <DataTable columns={shiftHistoryColumns} data={data![1]} />
      </div>
    );
  }
  return (
    <div
      className={
        "p-12 pt-2 w-full h-full flex-column justify-center items-center"
      }
    >
      <h1 className="text-center text-3xl my-7 font-bold">
        Details of animal {params?.id ?? ""}
      </h1>
      <div>{content}</div>
    </div>
  );
};
