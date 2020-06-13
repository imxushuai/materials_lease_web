import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/leaseProjectDetail',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/leaseProjectDetail/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/leaseProjectDetail',
    method: 'put',
    data
  })
}

export function endDetail(ids) {
  return request({
    url: 'api/leaseProjectDetail/endLeaseDetail',
    method: 'post',
    data: ids
  })
}

export default { add, edit, del, endDetail }
