var config = require('../config.js')
var host = config.host + config.reverseProxyAlias.enterpriseManageAPI
// 档期 API http://www.52drama.com:14805
module.exports = {
  getEmployeesByNameOrPhone: host + '/api/v1/Employee/EmployeesFNP', // 通过名字或电话号码查找员工

  getWorkflowFirstNodeMark: host + '/api/v1/WorkFlow/QueryFlowSetFirstNodeMark', //
  getReportToListByNameOrPhone: host + '/api/v1/WorkFlowInstance/Employees4FlowTo', // 通过名字或电话号码查找流程接受人。
  
}