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
  CreateFeedHistoryDto,
  feedHistoryApiSlice,
} from "@/store/feedHistoryApiSlice.ts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import { foodApiSlice } from "@/store/foodApiSlice.ts";

type AddFeedHistoryFormData = CreateFeedHistoryDto;
export const useAddFeedHistoryFormSchema = (): yup.ObjectSchema<
  AddFeedHistoryFormData,
  AnyObject,
  {
    animalId: undefined;
    keeperId: undefined;
    createdAt: undefined;
    foodId: undefined;
    amount: undefined;
  },
  ""
> => {
  return yup.object({
    animalId: yup.number().required("Animal is required"),
    keeperId: yup.number().required("Keeper is required"),
    createdAt: yup.date().required("Creation date is required"),
    foodId: yup.number().required("Food is required"),
    amount: yup
      .number()
      .required("Salary is required")
      .min(0.1, "Salary must be greater than 0"),
  });
};
export const AddFeedHistoryDialogForm = ({
  setOpenAddFeedHistoryDialog,
}: {
  setOpenAddFeedHistoryDialog: React.Dispatch<boolean>;
}) => {
  const [create, result] = feedHistoryApiSlice.useCreateFeedHistoryMutation();
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
  const {
    data: foods,
    isError: isErrorFoods,
    isLoading: isLoadingFoods,
  } = foodApiSlice.useGetAllFoodsQuery();
  const onSubmit = (data: AddFeedHistoryFormData) => {
    create(data);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Feed history created");
      setOpenAddFeedHistoryDialog(false);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error creating feed history");
    }
  }, [result.isError]);

  const form = useForm<AddFeedHistoryFormData>({
    resolver: yupResolver(useAddFeedHistoryFormSchema()),
    defaultValues: {
      animalId: 0,
      keeperId: 0,
      createdAt: new Date(),
      foodId: 0,
      amount: 0,
    },
    mode: "onChange",
  });

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
                <SelectContent className={"bg-white"}>
                  {isErrorAnimals ? (
                    <SelectItem className={"z-30 w-full"} disabled value={"."}>
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
                <SelectContent className={"z-5000 bg-white"}>
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
          name="createdAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Creation date</FormLabel>
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
                    disabled={(date) => date >= new Date()}
                  />
                </PopoverContent>
              </Popover>
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
            Add
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
