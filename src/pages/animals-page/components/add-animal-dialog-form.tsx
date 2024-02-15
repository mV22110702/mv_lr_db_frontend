import { animalApiSlice, CreateAnimalDto } from "@/store/animalApiSlice.ts";
import * as yup from "yup";
import { AnyObject } from "yup";
import { useToast } from "@/components/ui/use-toast.ts";
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

type AddAnimalFormData = CreateAnimalDto;
export const useAddAnimalFormSchema = (): yup.ObjectSchema<
  AddAnimalFormData,
  AnyObject,
  {
    scientificName: undefined;
    name: undefined;
  },
  ""
> => {
  return yup.object({
    scientificName: yup.string().required("Scientific name is required"),
    name: yup.string().required("Name is required"),
  });
};
export const AddAnimalDialogForm = ({
  setOpenAddAnimalDialog,
}: {
  setOpenAddAnimalDialog: React.Dispatch<boolean>;
}) => {
  const [create, result] = animalApiSlice.useCreateMutation();
  const onSubmit = (data: AddAnimalFormData) => {
    create(data);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Animal created");
      setOpenAddAnimalDialog(false);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error creating animal");
    }
  }, [result.isError]);

  const form = useForm<AddAnimalFormData>({
    resolver: yupResolver(useAddAnimalFormSchema()),
    defaultValues: { scientificName: "", name: "" },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="scientificName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scientific name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Scientific name of the animal.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Name of the animal.</FormDescription>
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
