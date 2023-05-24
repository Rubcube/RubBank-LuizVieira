import { PrismaClient } from '@prisma/client';
import { AddressIn, AddressUpdate } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  create = async (address: AddressIn) => {
    return await prisma.address.create({
      data: address
    });
  }

  getAddressByUser = async (userId: string, addressId: string) => {
    return await prisma.address.findFirst({
      where:{
        id: addressId,
        user_id: userId
      }
    })
  }

  update =async (data: AddressUpdate, addressId: string) => {
    return await prisma.address.update({
      where: { id: addressId},
      data: {
        ...data,
        updated_at: new Date()
      }
    })
  }
};