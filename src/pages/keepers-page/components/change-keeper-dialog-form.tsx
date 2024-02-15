import { keeperApiSlice, CreateKeeperDto } from "@/store/keeperApiSlice.ts";
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

type ChangeKeeperFormData = CreateKeeperDto;
export const useChangeKeeperFormSchema = (): yup.ObjectSchema<
  ChangeKeeperFormData,
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
export const ChangeKeeperDialogForm = ({
  keeperId,
  setKeeperId,
}: {
  keeperId: number | null;
  setKeeperId: React.Dispatch<number | null>;
}) => {
  const { data } = keeperApiSlice.useGetAllKeepersQuery();
  const keeper = data?.find((a) => a.id === keeperId) || {
    firstName: "",
    lastName: "",
  };
  const [update, result] = keeperApiSlice.useUpdateKeeperMutation();
  const onSubmit = (data: ChangeKeeperFormData) => {
    if (!keeperId) return;
    update({ id: keeperId, body: data });
  };
  useEffect(() => {
    if (result.isSuccess) {
      toast.success("Keeper updated");
      setKeeperId(null);
    }
  }, [result.isSuccess]);
  useEffect(() => {
    if (result.isError) {
      toast.error("Error updating keeper");
    }
  }, [result.isError]);

  const form = useForm<ChangeKeeperFormData>({
    resolver: yupResolver(useChangeKeeperFormSchema()),
    values: keeper,
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
              <FormDescription>First name of the keeper.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
