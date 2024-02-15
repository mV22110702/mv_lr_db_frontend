import {
  shiftApiSlice,
  CreateShiftDto,
  ShiftAnimalKeeperId,
} from "@/store/shiftApiSlice.ts";
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

type ChangeShiftFormData = Omit<CreateShiftDto, "animalId" | "keeperId">;
export const useChangeShiftFormSchema = (): yup.ObjectSchema<
  ChangeShiftFormData,
  AnyObject,
  {
    startsAt: undefined;
    endsAt: undefined;
    salary: undefined;
  },
  ""
> => {
  return yup.object({
    startsAt: yup
      .date()
      .required("Start date is required")
      .test({
        name: "startsAt",
        message: "Start date must be less than end date",
        test: function (value) {
          return value < this.parent.endsAt;
        },
      }),
    endsAt: yup
      .date()
      .required("End date is required")
      .test({
        name: "endsAt",
        message: "End date must be greater than start date",
        test: function (value) {
          return value > this.parent.startsAt;
        },
      }),
    salary: yup
      .number()
      .required("Salary is required")
      .min(0.1, "Salary must be greater than 0"),
  });
};
export const ChangeShiftDialogForm = ({
  shiftId,
  setShiftId,
}: {
  shiftId: ShiftAnimalKeeperId | null;
  setShiftId: React.Dispatch<ShiftAnimalKeeperId | null>;
}) => {
  const { data } = shiftApiSlice.useGetAllShiftsQuery();
  const shift = data?.find(
    (a) =>
      a.animal.id === shiftId?.animalId && a.keeper.id === shiftId?.keeperId,
  ) || {
    startsAt: new Date(),
    endsAt: new Date(),
    salary: 0,
  };
  const [update, result] = shiftApiSlice.useUpdateShiftMutation();
  const onSubmit = (data: ChangeShiftFormData) => {
    if (!shiftId) return;
    update({
      animalId: shiftId.animalId,
      keeperId: shiftId.keeperId,
      body: data,
    });
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Shift updated");
      setShiftId(null);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error updating shift");
    }
  }, [result.isError]);

  const form = useForm<ChangeShiftFormData>({
    resolver: yupResolver(useChangeShiftFormSchema()),
    values: shift,
    mode: "onChange",
  });

  const startsAt = form.watch("startsAt");
  const endsAt = form.watch("endsAt");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="startsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start date</FormLabel>
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
                    disabled={(date) => date >= endsAt}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endsAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End date</FormLabel>
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
                    disabled={(date) => date <= startsAt}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input {...field} type={"number"} step={0.1} min={0.1} />
              </FormControl>
              <FormDescription>Salary</FormDescription>
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
