import {
  feedHistoryApiSlice,
  CreateFeedHistoryDto,
  FindFeedHistoryDto,
  FeedHistory,
} from "@/store/feedHistoryApiSlice.ts";
import * as yup from "yup";
import { AnyObject } from "yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { foodApiSlice } from "@/store/foodApiSlice.ts";

type ChangeFeedHistoryFormData = Omit<
  CreateFeedHistoryDto,
  "animalId" | "keeperId" | "createdAt"
>;
export const useChangeFeedHistoryFormSchema = (): yup.ObjectSchema<
  ChangeFeedHistoryFormData,
  AnyObject,
  {
    foodId: undefined;
    amount: undefined;
  },
  ""
> => {
  return yup.object({
    foodId: yup.number().required("Food is required"),
    amount: yup
      .number()
      .required("Salary is required")
      .min(0.1, "Salary must be greater than 0"),
  });
};
export const ChangeFeedHistoryDialogForm = ({
  feedHistoryId,
  setFeedHistoryId,
}: {
  feedHistoryId: FindFeedHistoryDto | null;
  setFeedHistoryId: React.Dispatch<FindFeedHistoryDto | null>;
}) => {
  const { data } = feedHistoryApiSlice.useGetAllFeedHistoriesQuery(undefined);
  const feedHistory =
    data?.find(
      (a) =>
        a.animal.id === feedHistoryId?.animalId &&
        a.keeper.id === feedHistoryId?.keeperId &&
        a.createdAt === feedHistoryId?.createdAt,
    ) ||
    ({
      foodId: 0,
      amount: 0,
    } as never as FeedHistory);
  const [update, result] = feedHistoryApiSlice.useUpdateFeedHistoryMutation();
  const onSubmit = (data: ChangeFeedHistoryFormData) => {
    if (!feedHistoryId) return;
    update({
      animalId: feedHistoryId.animalId,
      keeperId: feedHistoryId.keeperId,
      createdAt: feedHistoryId.createdAt,
      foodId: data.foodId,
      amount: data.amount,
    });
  };
  const {
    data: foods,
    isError: isErrorFoods,
    isLoading: isLoadingFoods,
  } = foodApiSlice.useGetAllFoodsQuery();

  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Feed history updated");
      setFeedHistoryId(null);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error updating feed history");
    }
  }, [result.isError]);

  const form = useForm<ChangeFeedHistoryFormData>({
    resolver: yupResolver(useChangeFeedHistoryFormSchema()),
    values: {
      foodId: feedHistory.food.id,
      amount: feedHistory.amount,
    },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="foodId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select food" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={"z-5000 bg-white"}>
                  {isErrorFoods ? (
                    <SelectItem disabled value={"."}>
                      Error loading food
                    </SelectItem>
                  ) : isLoadingFoods ? (
                    <SelectItem disabled value={"."}>
                      Loading...
                    </SelectItem>
                  ) : (
                    foods!.map((food) => (
                      <SelectItem key={food.id} value={food.id.toString()}>
                        {food.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} type={"number"} step={0.1} min={0.1} />
              </FormControl>
              <FormDescription>Amount</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button
            type="submit"
            disabled={!form.formState.isValid || result.isLoading}
          >
            {result.isLoading && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
