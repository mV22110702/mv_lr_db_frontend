import { FC } from "react";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { AppRoute } from "@/lib/enums/app-route.enum.ts";
import { useNavigate } from "react-router-dom";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className={"p-12 w-full h-full flex-column justify-center items-center"}
    >
      <h1 className="text-center text-3xl font-bold underline">
        Welcome to zoo management app!
      </h1>
      <div className={`m-10 border-solid border-2 rounded-md border-gray`}>
        <Command>
          <CommandList>
            {commands.map(({ title, link }) => (
              <CommandItem
                onSelect={() => {
                  navigate(link);
                }}
                className={"hover:cursor-pointer"}
              >
                {title}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

const commands: CommandPick[] = [
  {
    title: "Animals",
    link: AppRoute.ANIMALS.ROOT,
  },
  {
    title: "Keepers",
    link: AppRoute.KEEPERS.ROOT,
  },
  {
    title: "Shifts",
    link: AppRoute.SHIFTS.ROOT,
  },
  {
    title: "Food",
    link: AppRoute.FOOD.ROOT,
  },
  {
    title: "Feed History",
    link: AppRoute.FEED_HISTORY.ROOT,
  },
];

export type CommandPick = {
  title: string;
  link: string;
};
