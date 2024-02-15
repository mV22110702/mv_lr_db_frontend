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
import { CreateShiftDto, shiftApiSlice } from "@/store/shiftApiSlice.ts";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { SelectContent } from "@radix-ui/react-select";
import { animalApiSlice } from "@/store/animalApiSlice.ts";
import { keeperApiSlice } from "@/store/keeperApiSlice.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar.tsx";

type AddShiftFormData = CreateShiftDto;
export const useAddShiftFormSchema = (): yup.ObjectSchema<
  AddShiftFormData,
  AnyObject,
  {
    animalId: undefined;
    keeperId: undefined;
    startsAt: undefined;
    endsAt: undefined;
    salary: undefined;
  },
  ""
> => {
  return yup.object({
    animalId: yup.number().required("Animal is required"),
    keeperId: yup.number().required("Keeper is required"),
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
export const AddShiftDialogForm = ({
  setOpenAddShiftDialog,
}: {
  setOpenAddShiftDialog: React.Dispatch<boolean>;
}) => {
  const [create, result] = shiftApiSlice.useCreateShiftMutation();
  const {
    data: animals,
    isError: isErrorAnimals,
    isLoading: isLoadingAnimals,
  } = animalApiSlice.useGetAllAnimalsQuery();
  const {
    data: keepers,
    isError: isErrorKeepers,
    isLoading: isLoadingKeepers,
  } = keeperApiSlice.useGetAllKeepersQuery();
  const onSubmit = (data: AddShiftFormData) => {
    create(data);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Shift created");
      setOpenAddShiftDialog(false);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error creating shift");
    }
  }, [result.isError]);

  const form = useForm<AddShiftFormData>({
    resolver: yupResolver(useAddShiftFormSchema()),
    defaultValues: {
      animalId: 0,
      keeperId: 0,
      startsAt: new Date(),
      endsAt: new Date(),
      salary: 0,
    },
    mode: "onChange",
  });

  const startsAt = form.watch("startsAt");
  const endsAt = form.watch("endsAt");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="animalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Animal</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={'bg-white'}>
                  {isErrorAnimals ? (
                    <SelectItem className={'z-30 w-full'} disabled value={"."}>
                      Error loading animals
                    </SelectItem>
                  ) : isLoadingAnimals ? (
                    <SelectItem disabled value={"."}>
                      Loading...
                    </SelectItem>
                  ) : (
                    animals!.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id.toString()}>
                        {animal.name} ({animal.scientificName})
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
          name="keeperId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keeper</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select keeper" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={'z-5000 bg-white'}>
                  {isErrorKeepers ? (
                    <SelectItem disabled value={"."}>
                      Error loading animals
                    </SelectItem>
                  ) : isLoadingKeepers ? (
                    <SelectItem disabled value={"."}>
                      Loading...
                    </SelectItem>
                  ) : (
                    keepers!.map((keeper) => (
                      <SelectItem key={keeper.id} value={keeper.id.toString()}>
                        {keeper.firstName} {keeper.lastName}
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
                          <Input {...field} type={'number'} step={0.1} min={0.1} />
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
            Add
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
