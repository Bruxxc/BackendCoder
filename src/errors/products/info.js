export const generateProductInfoError = (product)=>{
    return `One or more properties were incomplete or not valid
    List of required properties:
    * title : needs to be a >>string<<, recieved: *** ${product.title} *** of type: >>${typeof product.title}<<
    * description: needs to be a >>string<<, recieved: *** ${product.description} *** of type: >>${typeof product.description}<<
    * price: needs to be a >>number<<, recieved: *** ${product.price} *** of type: >>${typeof product.price}<<
    * stock: needs to be a >>number<<, recieved: *** ${product.stock} *** of type: >>${typeof product.stock}<<
    * category: needs to be a >>string<<, recieved: *** ${product.category} *** of type: >>${typeof product.category}<<
    * thumbnail: optional, if defined needs to be a >>string<<, recieved: *** ${product.thumbnail} *** of type: >>${typeof product.thumbnail}<<
    `
};