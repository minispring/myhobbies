package controllers

import play.api.mvc.{Action, Controller}
import models.{Contact, User}
import com.mongodb.casbah.commons.MongoDBObject
import java.util.Date
import org.bson.types.ObjectId

object People extends Controller{

  def avatar = Action { request =>
    implicit val user = User.findOne(MongoDBObject("name" -> "admin")).get
    val personId = request.getQueryString("id").getOrElse("")
    val followed = Contact.findPersonByOwner(new ObjectId(personId)).isDefined;
    val person = User.findOneById(new ObjectId(personId)).get
    Ok(views.html.post.avatarModal(person,followed))
  }

  def follow = Action { request =>
    implicit val user = User.findOne(MongoDBObject("name" -> "admin")).get
    val now = new Date()
    val personId = request.getQueryString("id").getOrElse("")
    Contact.save(Contact(owner = user.id,person = new ObjectId(personId),create_at = now))
    Ok
  }

  def unfollow = Action { request =>
    implicit val user = User.findOne(MongoDBObject("name" -> "admin")).get
    val now = new Date()
    val personId = request.getQueryString("id").getOrElse("")
    Contact.findPersonByOwner(new ObjectId(personId)) map { contact =>
      Contact.remove(contact)
    }
    Ok
  }

}
