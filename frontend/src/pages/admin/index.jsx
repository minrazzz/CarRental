import { AdminTabs } from '../../components/admin-tabs'
import { Layout } from '../../components/layout'
import { PrivateRoute } from '../../components/private-route'

const AdminPage = () => {
  return (
    <PrivateRoute allowedRoles={['admin']}>
      <Layout title='Admin'>
        <AdminTabs />
      </Layout>
    </PrivateRoute>
  )
}

export default AdminPage
