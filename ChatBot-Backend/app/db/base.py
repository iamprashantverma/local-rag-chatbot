from sqlalchemy.orm import declarative_base
#declarative_base is a SQLAlchemy function used to create 
#a base class for ORM models.

Base = declarative_base()
#This creates a base class called Base that all database models must inherit from.

#test