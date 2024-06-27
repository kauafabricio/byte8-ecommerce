import { User, Order } from "../models/models.js";

// API POST: processamento do pedido do usuário

export default async function processOrder(req, res) {
  const { userId, items, address, totalAmount, discountAmount } = req.body;

  try {
    if (userId) {
      const user = await User.findOne({ _id: userId });

      if (user) {
        const orderItems = items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.productQuantity,
          individualPrice: item.productPrice,
          totalPrice: item.productPrice * item.productQuantity,
          productImg: item.productImg
        }));
        
        const orderNumber = await Order.countDocuments() + 1;
        const newOrder = new Order({
          userId,
          orderNumber,
          orderDate: new Date(),
          shippingAddress: address,
          paymentMethod: 'Credit Card',
          totalAmount,
          status: 'Processing',
          shippingCost: 0,
          discountAmount: discountAmount || 0, 
          items: orderItems,
          trackingNumber: Math.floor(Math.random() * 1000000)
        });

        await newOrder.save();
        user.userOrders.push(newOrder);
        user.userBag = []
        await user.save();

        res.status(200).json({ "message": 'Seu pedido foi realizado com sucesso.' });
      } else {
        return res.status(404).json({ "error": 'Usuário não encontrado.' });
      }
    } else {
      return res.status(404).json({ "error": 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ "error": "Internal server error" });
  }
}
