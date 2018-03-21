
export const selectPlay = function({commit,state},nickName){
	commit('updateUserInfo',nickName)
}
