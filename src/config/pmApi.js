/**
 * Created by Jancheng on 2017/9/6.
 * 主要用于存储PM基础配置文件
 */
// const baseUrl = "http://10.76.35.171:9480/";
const baseUrl = "http://10.73.12.81:11000/";
//API接口
const api = {
    //所有API需要自己根据业务重新定义
    // userLogin: baseUrl + "core/user/login", //用户登陆
    // userRegister: baseUrl + "user/register", //用户注册
    // getCheckedToken: baseUrl + "token/verification", //获取token验证
    // refreshAccessToken: baseUrl + "token/refresh", //刷新access_token验证
    // getMessageCode: baseUrl + "token/sms", //获取短信验证码
    // resetPassword: baseUrl + "password/back", //密码重置
    // modifyPassword: baseUrl + "password/modification", //密码修改
    // verifyPassword: baseUrl + "password/verification", //验证密码正确性
    // getAvatorList: baseUrl + "user/default_avatar", //获取默认头像列表
    // userSignout: baseUrl + "user/signout", //退出登录
    // uploadAvator: baseUrl + "user/avatar", //头像上传
    // verificationCode: baseUrl + "token/sms/verification", //短信验证码验证
    // getPersonalInfo: baseUrl + "user/info", //获取个人信息
    // updateUserInfo: baseUrl + "user/info", //更新用户个人信息
    //
    // judgeHaveTeam: baseUrl + "judgeHaveTeam", //判断用户是否存在团队
    // getTeamList: baseUrl + "getTeamList", //获取团队列表
    // getTaskList: baseUrl + "getTaskList", //获取任务列表
    // getNoticeList: baseUrl + "getNoticeList", //获取通知列表
    // getInviteList: baseUrl + "getInviteList", //获取邀请列表
    // setMsgReadStatus: baseUrl + "setMsgReadStatus", //设置消息查看状态
    // judgeUserIsRegster: baseUrl + "user/exist", //判断用户是否已经注册
    // buildNewGroup: baseUrl + "buildNewGroup", //创建新的团队
    // teamTransfer: baseUrl + "teamTransfer", //团队转移
    // teamDissolve: baseUrl + "teamDissolve", //团队解散
    // modifyTeamInfo: baseUrl + "modifyTeamInfo", //修改团队信息
    // getMemberList: baseUrl + "memberList", //获取团队成员列表
    // deleteMember: baseUrl + "deleteMemeber", //删除团队成员
    // changeRole: baseUrl + "changeRole", //更改团队成员权限（角色）
    // addMember: baseUrl + "addMember", //添加团队成员
    // uploadDocument: baseUrl + "uploadDocument", //文档上传
    // getDocumentList: baseUrl + "documentList", //获取文档列表(分页,查询)
    // downloadDocument: baseUrl + "downloadDocument", //文档下载
    // deleteDocument: baseUrl + "deleteDocument", //文档删除
    // getRoleInfo: baseUrl + "getRoleInfo", //获取角色数据
    // getRoleResource: baseUrl + "getRoleResource", //获取角色资源数据
    // updateRoleResource: baseUrl + "updateRoleResource", //更新角色资源数据
    // addProjectRole: baseUrl + "addProjectRole", //添加项目角色数据
    // updateProjectRole: baseUrl + "updateProjectRole", //修改项目角色数据
    // delProjectRole: baseUrl + "delProjectRole", //删除项目角色数据
    // getProjectList: baseUrl + "getProjectList", //获取项目列表
    // getDefaultManager: baseUrl + "getDefaultManager", //获取默认项目经理(自己)信息
    // createNewProject: baseUrl + "createNewProject", //创建新的项目
    // getProjectMember: baseUrl + "getProjectMember", //获取项目成员列表
    // searchProject: baseUrl + "searchProject", //检索项目
    // deleteProjectMember: baseUrl + "deleteProjectMember", //删除项目成员
    // overallSearch: baseUrl + "search", //全局搜素
    // getProjectInfo: baseUrl + "getProjectInfo", //获取项目明细
    // judgeProjectName: baseUrl + "judgerojectName", //验证项目名重复
    // judgeProjectNumber: baseUrl + "judgeProjectNumber", //验证项目编号
    // loadGantDataInfo: baseUrl + "plan/ganttChart/view", //加载甘特图数据信息
    // submitAddGanttTask: baseUrl + "plan/planTask/new", //新增甘特图计划数据
    // submitUpdateGanttTask: baseUrl + "plan/planTask/edit", //修改甘特图计划数据
    // submitDeleteGanttTask: baseUrl + "plan/planTask/logicalDel", //删除甘特图计划数据
    // submitAddGanttLink: baseUrl + "plan/planTaskRelation/new", //新增甘特图关系数据
    // submitUpdateGanttLink: baseUrl + "plan/planTaskRelation/edit", //修改甘特图关系数据
    // submitDeleteGanttLink: baseUrl + "plan/planTaskRelation/logicalDel", //删除甘特图关系数据
    // submitUpdateGanttSortOrder: baseUrl + "plan/planTask/move", //修改甘特图排序
    // submitUpdatePlanInfo: baseUrl + "plan/plan/edit", //修改计划数据
    // submitImportPlan: baseUrl + "plan/mppFile/import" ,//提交计划导入
    // submitExportPlan: baseUrl + "plan/mppFile/export" //提交计划导出
};
//是否为mock数据
const isMock = true;
const config = {
    api: api,
    isMock: isMock
};
export default config;
