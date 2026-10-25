import {useEffect} from 'react'
import {useProduct} from '../hook/use.product'
import { useSelector } from 'react-redux';

const Dashboard = () => {
    const {handleGetSellerProduct} = useProduct();
    const sellerProducts = useSelector((state) => state.product.sellerProducts);

    useEffect(()=>{
        handleGetSellerProduct();
    },[])

    console.log(sellerProducts)
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard