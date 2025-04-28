// keycloak-js.d.ts
import type { KeycloakProfile as OriginalKeycloakProfile } from "keycloak-js";

declare module "keycloak-js" {
  interface IProfile extends Omit<OriginalKeycloakProfile, "attributes"> {
    attributes: {
      avatar: string;
      bio: string;
    } & Record<string, unknown>;
  }
}
