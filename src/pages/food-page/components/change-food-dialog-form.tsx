import { foodApiSlice, CreateFoodDto } from "@/store/foodApiSlice.ts";
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
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";

type ChangeFoodFormData = CreateFoodDto;
export const useChangeFoodFormSchema = (): yup.ObjectSchema<
  ChangeFoodFormData,
  AnyObject,
  {
    name: undefined;
    amount: undefined;
    restockedAt: undefined;
    usedAt: undefined;
  },
  ""
> => {
  return yup.object({
    name: yup.string().required("Name is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .min(0, "Amount must be greater than or equal to 0"),
    restockedAt: yup.date().required("Restock date is required"),
    usedAt: yup.date().required("Use date is required"),
  });
};
export const ChangeFoodDialogForm = ({
  foodId,
  setFoodId,
}: {
  foodId: number | null;
  setFoodId: React.Dispatch<number | null>;
}) => {
  const { data } = foodApiSlice.useGetAllFoodsQuery();
  const food = data?.find((a) => a.id === foodId) || {
    name: "",
    amount: 0,
    restockedAt: new Date(),
    usedAt: new Date(),
  };
  const [update, result] = foodApiSlice.useUpdateFoodMutation();
  const onSubmit = (data: ChangeFoodFormData) => {
    if (!foodId) return;
    update({ id: foodId, body: data });
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Food updated");
      setFoodId(null);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error updating food");
    }
  }, [result.isError]);

  const form = useForm<ChangeFoodFormData>({
    resolver: yupResolver(useChangeFoodFormSchema()),
    values: food,
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Name of food.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (g)</FormLabel>
              <FormControl>
                <Input {...field} type={"number"} min={0.1} step={0.1} />
              </FormControl>
              <FormDescription>Amount of food.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="restockedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Restock date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="usedAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Use date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
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
