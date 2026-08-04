export const state={
  language:'en',
  masterId:'valora',
  currentAffinity:0,
  targetAffinity:0,
  selectedSkillId:null,
  currentSkill:0,
  targetSkill:0,
  inventory:{}
};
export function patchState(patch){
  Object.assign(state,patch);
}
