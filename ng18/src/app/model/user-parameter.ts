export interface UserParameter {
  id: string;
  userId: string;
  parameterName: string;
  parameterValue: string;
  auditInfo: {
    version: number;
    whoInserted: string;
    whenInserted: string;
    whoEdited: string;
    whenEdited: string;
  };
  data: Record<string, unknown>;
}
