import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/leaseProject',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/leaseProject/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/leaseProject',
    method: 'put',
    data
  })
}

export function findSelectData() {
  return request({
    url: 'api/leaseProject/findSelectData',
    method: 'get'
  })
}

export default { add, edit, del, findSelectData }
