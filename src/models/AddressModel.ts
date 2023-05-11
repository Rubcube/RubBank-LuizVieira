import { PrismaClient } from '@prisma/client';
import { AddressIn } from 'dtos/AddressDTO';

const prisma = new PrismaClient();

export default class AddressModel {

  create = async (address: AddressIn) => {
    return await prisma.address.create({
      data: address
    });
  }
};