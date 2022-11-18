import * as React from "react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import {
  CallComposite,
  FluentThemeProvider,
  darkTheme,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationCallAdapter,
} from "@azure/communication-react";

const CallCompositeWrapper = ({
  token,
  userid,
  participantids,
  displayname,
}) => {
  // A well-formed token is required to initialize the chat and calling adapters.
  const credential = React.useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(token);
    } catch {
      console.error("Failed to construct token credential");
      return undefined;
    }
  }, [token]);

  // Memoize arguments to `useAzureCommunicationCallAdapter` so that
  // a new adapter is only created when an argument changes.
  const callAdapterArgs = React.useMemo(
    () => ({
      userId: fromFlatCommunicationIdentifier(userid),
      displayName: displayname,
      credential,
      locator: { participantIds: participantids.split(",") },
    }),
    [userid, displayname, credential, participantids]
  );
  const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);
  if (callAdapter) {
    return (
      <FluentThemeProvider fluentTheme={darkTheme}>
        <div style={{ height: "100vh", display: "flex" }}>
          <CallComposite adapter={callAdapter} />
        </div>
      </FluentThemeProvider>
    );
  }
  if (credential === undefined) {
    return (
      <h3>Failed to construct credential. Provided token is malformed.</h3>
    );
  }
  return <h3>Initializing...</h3>;
};

export default CallCompositeWrapper;
