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
import { CreateKeeperDto, keeperApiSlice } from "@/store/keeperApiSlice.ts";

type AddKeeperFormData = CreateKeeperDto;
export const useAddAnimalFormSchema = (): yup.ObjectSchema<
  AddKeeperFormData,
  AnyObject,
  {
    firstName: undefined;
    lastName: undefined;
  },
  ""
> => {
  return yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
  });
};
export const AddKeeperDialogForm = ({
  setOpenAddKeeperDialog,
}: {
  setOpenAddKeeperDialog: React.Dispatch<boolean>;
}) => {
  const [create, result] = keeperApiSlice.useCreateKeeperMutation();
  const onSubmit = (data: AddKeeperFormData) => {
    create(data);
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Keeper created");
      setOpenAddKeeperDialog(false);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error creating keeper");
    }
  }, [result.isError]);

  const form = useForm<AddKeeperFormData>({
    resolver: yupResolver(useAddAnimalFormSchema()),
    defaultValues: { firstName: "", lastName: "" },
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>First name of the keeper</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Last name of the keeper.</FormDescription>
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
