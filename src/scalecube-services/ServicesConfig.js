// @flow
import { Microservices, ServiceDefinition } from 'src/scalecube-services';

class Builder {
  servicesBuilder: ServicesConfig[];
  microservicesBuilder: Microservices.Builder;

  constructor(builder: Microservices.Builder){
    this.servicesBuilder = [];
    this.microservicesBuilder = builder;
  }
  builder(builder: Microservices.Builder) {
    this.microservicesBuilder = builder;
  }
  build() { // TODO return Microservices.Builder
    return this.microservicesBuilder.services(
      new ServicesConfig(this.servicesBuilder));
  }
  services(...services:any[]) {
    services[0].map((o)=>{
      if( typeof o === 'function') {
        console.error(new Error(`${o.name} is a class not instance`));
      }
      this.add(new ServicesConfig(o));
    });
    return this;
  }
  add(serviceBuilder:ServicesConfig) {
    this.servicesBuilder.push(serviceBuilder);
    return this;
  }
  create() {
    return new ServicesConfig(this.servicesBuilder);
  }
}
//extends ServicesConfigApi
export class ServicesConfig{
  static Builder = Builder; // getter can't be validate by flow; const not supported; if you hack it, it's your problem
  service: any;
  serviceDefinition: ServiceDefinition;
  mcBuilder: Microservices.Builder;
  servicesConfig: ServicesConfig[];

  // public ServiceConfig(Object service) {
  // public ServiceConfig(Builder builder, Object service) {
  constructor(service: any, builder: ?Microservices.Builder) {
    if( service && Array.isArray(service) ) {
      this.servicesConfig = service;
      return this;
    }
    if( builder && builder.constructor && builder.constructor.name !== 'Builder' ) {
      this.mcBuilder = builder;
    }
    this.service = service;
    this.serviceDefinition = ServiceDefinition.from(service);
    return this;
  }
  static builder(builder: Microservices.Builder) {
    // TODO change it when splitting to files
    return new Builder(builder);
  }
}