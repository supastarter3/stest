"use client";

import { appConfig } from "@config";
import { useUser } from "@saas/auth/hooks/use-user";
import { updateTeamSlugCookie } from "@saas/auth/lib/team-slug";
import { createTeamDialogOpen } from "@saas/dashboard/state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { Icon } from "@ui/components/icon";
import BoringAvatar from "boring-avatars";
import { Team } from "database";
import { useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { CreateTeamDialog } from "./CreateTeamDialog";

export function TeamSelect({
  teams,
  className,
}: {
  teams: Team[];
  className?: string;
}) {
  const t = useTranslations();
  const setCreateTeamDialogOpen = useSetAtom(createTeamDialogOpen);
  const router = useRouter();
  const { teamMembership } = useUser();
  const activeTeam = teams.find((team) => team.id === teamMembership?.team_id);

  const switchTeam = (slug: string) => {
    if (!activeTeam) return;

    updateTeamSlugCookie(slug);
    location.reload();
  };

  if (!activeTeam) return null;

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-ring focus-visible:border-primary -ml-2 flex w-full items-center justify-between rounded-md px-2 py-2 text-left outline-none focus-visible:ring-1">
          <div className="flex items-center justify-start gap-2 text-sm">
            <span className="hidden lg:block">
              <BoringAvatar
                size={32}
                name={activeTeam.name}
                variant="marble"
                colors={appConfig.teams.avatarColors}
              />
            </span>
            <span className="block flex-1 truncate">{activeTeam.name}</span>
            <Icon.select className="block h-4 w-4 opacity-50" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          <DropdownMenuRadioGroup
            value={activeTeam.slug}
            onValueChange={switchTeam}
          >
            {teams.map((team) => (
              <DropdownMenuRadioItem
                key={team.id}
                value={team.slug}
                className="flex items-center justify-center gap-2"
              >
                <div className="flex flex-1 items-center justify-start gap-2">
                  <BoringAvatar
                    size={16}
                    name={team.name}
                    variant="marble"
                    colors={appConfig.teams.avatarColors}
                  />
                  {team.name}
                </div>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setCreateTeamDialogOpen(true)}>
              <Icon.plus className="mr-2 h-4 w-4" />
              {t("dashboard.sidebar.createTeam")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTeamDialog />
    </div>
  );
}
