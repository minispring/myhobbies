package models

import play.api.Play.current
import java.util.Date
import com.novus.salat.annotations._
import se.radley.plugin.salat.Binders._
import org.bson.types.ObjectId
import se.radley.plugin.salat.Binders.ObjectId
import com.novus.salat.dao.{SalatDAO, ModelCompanion}
import se.radley.plugin.salat._
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.casbah.Imports._
import mongoContext._
import securesocial.core._
import com.mongodb.casbah.commons.TypeImports._
import org.joda.time.DateTime

case class Like(
  id: ObjectId = new ObjectId,
  author: IdentityId,
  source_id: ObjectId,
  source_type: String = "POST",
  create_at: DateTime,
  update_at: DateTime
)

object Like extends ModelCompanion[Like, ObjectId]{

  val collection = mongoCollection("likes")
  val dao = new SalatDAO[Like, ObjectId](collection = collection) {}

  def counts(postId:ObjectId,sourceType:String = "POST") = count(MongoDBObject("source_id" -> postId, "source_type" -> sourceType))

  def findBySource(sourceId:ObjectId,sourceType:String = "POST")(implicit user: Identity) = findOne(
    MongoDBObject("source_id" -> sourceId, "source_type" -> sourceType, "author" -> user.identityId)
  )

  def exists(sourceId:ObjectId,sourceType:String = "POST")(implicit user: Identity) = findBySource(sourceId,sourceType) match {
    case Some(_) => true
    case None => false
  }

}
